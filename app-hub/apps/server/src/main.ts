import { WebSocketServer, WebSocket } from 'ws'
import https from 'https'
import path from 'path'
import { readFileSync } from 'fs'

import type { Payload } from '../../../shared/src/types'
import { splitRoute } from '../../../shared/src/utils'
import {
  NetworkType,
  LobbyType,
  type AnyWirePayload,
  type RegisterMsg,
  type Role
} from '../../../shared/src/network/messages'

// ---------------------------------------------------------------------------
//  Session tracking
// ---------------------------------------------------------------------------

type Session = {
  tv: WebSocket
  controllers: Set<WebSocket>
}

const sessions = new Map<string, Session>()
const pending = new Set<WebSocket>()

// ---------------------------------------------------------------------------
//  HTTPS + WSS
// ---------------------------------------------------------------------------

const certDir = path.resolve(process.cwd(), '../../certs')
const key = readFileSync(path.join(certDir, '/multi-ip-key.pem'))
const cert = readFileSync(path.join(certDir, '/multi-ip.pem'))

const server = https.createServer({ key, cert })
const wss = new WebSocketServer({ server })

server.listen(8081, '0.0.0.0', () =>
  console.info('[relay] HTTPS+WSS listening on wss://0.0.0.0:8081')
)

// ---------------------------------------------------------------------------
//  Helpers
// ---------------------------------------------------------------------------

const isOpen = (ws: WebSocket) => ws.readyState === WebSocket.OPEN

const safeSend = (ws: WebSocket | undefined, payload: Payload) => {
  if (!ws || !isOpen(ws)) return
  ws.send(JSON.stringify(payload))
}

const now = () => Date.now()

const reject = (ws: WebSocket, reason: any, session?: string) => {
  safeSend(ws, {
    type: NetworkType.REJECT,
    msg: { reason, session },
    t: now()
  })
}

const sendTvListTo = (ws: WebSocket) => {
  safeSend(ws, {
    type: LobbyType.TV_LIST,
    msg: { list: Array.from(sessions.keys()) },
    t: now()
  })
}

const broadcastTvList = () => {
  for (const ws of pending) sendTvListTo(ws)
  for (const s of sessions.values())
    for (const c of s.controllers) sendTvListTo(c)
}

const closeAllControllers = (s: Session, code: number, reason: string) => {
  for (const c of s.controllers) {
    try {
      c.close(code, reason)
    } catch {
      // ignore
    }
  }
}

// ---------------------------------------------------------------------------
//  Registration
// ---------------------------------------------------------------------------

const handleRegister = (socket: WebSocket, msg: RegisterMsg) => {
  const role: Role | undefined = msg.role
  const id: string | undefined = msg.id
  const session: string | undefined = msg.session

  if (!role) return reject(socket, 'MISSING_ROLE')
  if (!id) return reject(socket, 'MISSING_ID')

  if (role === 'TV') {
    if (!session) return reject(socket, 'MISSING_SESSION')

    const old = sessions.get(session)
    if (old?.tv && old.tv !== socket) {
      try {
        old.tv.close(1012, 'TV replaced')
      } catch {
        // ignore
      }
      closeAllControllers(old, 1012, 'TV replaced')
    }
    sessions.set(session, { tv: socket, controllers: new Set() })
    pending.delete(socket)

    safeSend(socket, {
      type: NetworkType.ACK,
      msg: { role: 'TV', session },
      t: now()
    })

    console.info(`[relay] TV registered session=${session} id=${id}`)
    broadcastTvList()
    return
  }

  if (role === 'CONTROLLER') {
    if (!session) return reject(socket, 'MISSING_SESSION')

    const s = sessions.get(session)
    if (!s) return reject(socket, 'NO_SESSION', session)

    s.controllers.add(socket)
    pending.delete(socket)

    safeSend(socket, {
      type: NetworkType.ACK,
      msg: { role: 'CONTROLLER', session },
      t: now()
    })

    // Notify TV a controller joined (keep this as a plain forwardable payload)
    safeSend(s.tv, {
      type: 'SESSION.PLAYER_JOINED',
      msg: { session, id, name: msg.name ?? 'Player' },
      t: now()
    })

    console.info(`[relay] Controller joined session=${session} id=${id}`)
  }
}

// ---------------------------------------------------------------------------
//  WS Handling
// ---------------------------------------------------------------------------

wss.on('connection', (socket) => {
  pending.add(socket)
  // Always provide discovery immediately
  sendTvListTo(socket)

  socket.on('message', (raw) => {
    let payload: AnyWirePayload
    try {
      payload = JSON.parse(raw.toString())
    } catch {
      reject(socket, 'INVALID_JSON')
      return
    }

    console.log(payload)
    if (
      !payload ||
      typeof payload.type !== 'string' ||
      typeof payload.msg !== 'object' ||
      payload.msg === null
    ) {
      reject(socket, 'UNKNOWN')
      return
    }
    // Back-compat: support your current string enums during transition
    // session.register.tv -> treat as NETWORK.REGISTER role=TV
    // session.register.player -> treat as NETWORK.REGISTER role=CONTROLLER
    if (payload.type === 'session.register.tv') {
      const m: any = payload.msg
      return handleRegister(socket, {
        role: 'TV',
        id: m.session ?? 'TV',
        session: m.session
      })
    }

    if (payload.type === 'session.register.player') {
      const m: any = payload.msg
      return handleRegister(socket, {
        role: 'CONTROLLER',
        id: m.id ?? 'CONTROLLER',
        session: m.session,
        name: m.name
      })
    }

    const { domain, type } = splitRoute(payload.type)

    // Core network control
    if (domain === 'NETWORK') {
      if (type === 'REGISTER') {
        return handleRegister(socket, payload.msg as any)
      }

      if (type === 'PING') {
        safeSend(socket, { type: NetworkType.PONG, msg: {}, t: now() })
        return
      }

      if (type === 'PONG') return
    }

    // Session routing for everything else: requires msg.session
    const session = (payload.msg as any).session as string | undefined
    if (!session) return

    const s = sessions.get(session)
    if (!s) return

    // TV -> controllers
    if (socket === s.tv) {
      for (const c of s.controllers) safeSend(c, payload as any)
      return
    }

    // Controller -> TV
    safeSend(s.tv, payload as any)
  })

  socket.on('close', () => {
    pending.delete(socket)

    for (const [session, s] of sessions) {
      if (s.tv === socket) {
        sessions.delete(session)
        console.info(`[relay] TV closed session=${session}`)

        for (const c of s.controllers) {
          safeSend(c, {
            type: 'SESSION.PLAYER_LEFT',
            msg: { session, reason: 'TV_DISCONNECTED' },
            t: now()
          })
        }

        broadcastTvList()
        return
      }

      if (s.controllers.delete(socket)) {
        console.info(`[relay] Controller left session=${session}`)
        safeSend(s.tv, {
          type: 'SESSION.PLAYER_LEFT',
          msg: { session },
          t: now()
        })
        return
      }
    }
  })
})

wss.on('error', (err) => console.error('[relay] error', err))
