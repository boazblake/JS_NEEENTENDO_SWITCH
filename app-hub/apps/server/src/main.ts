import { WebSocketServer, WebSocket } from 'ws'
import https from 'https'
import path from 'path'
import { readFileSync } from 'fs'
import { MessageType, Screen, type Payload } from '../../../shared/src/types.ts'

// ---------------------------------------------------------------------------
//  Session tracking
// ---------------------------------------------------------------------------

interface Session {
  tv: WebSocket
  controllers: Set<WebSocket>
}

const sessions = new Map<string, Session>()
const pendingControllers = new Set<WebSocket>()

// ---------------------------------------------------------------------------
//  HTTPS + WSS
// ---------------------------------------------------------------------------

const certDir = path.resolve(process.cwd(), '../../certs')
const key = readFileSync(path.join(certDir, '/multi-ip-key.pem'))
const cert = readFileSync(path.join(certDir, '/multi-ip.pem'))

const server = https.createServer({ key, cert })
const wss = new WebSocketServer({ server })

server.listen(8081, '0.0.0.0', () =>
  console.info('[relay] HTTPS+WSS listening on wss://192.168.7.195:8081')
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

const relayHello = (socket: WebSocket): void => {
  safeSend(socket, {
    type: MessageType.RELAY_HELLO,
    msg: { t: now(), message: 'connected' },
    t: now()
  })
}

// Send updated TV list to all controllers
const broadcastTVList = (): void => {
  const tvList = Array.from(sessions.keys())

  const payload: Payload = {
    type: MessageType.TV_LIST,
    msg: {
      screen: Screen.LOBBY,
      list: tvList
    },
    t: now()
  }

  for (const c of pendingControllers) safeSend(c, payload)
  for (const s of sessions.values())
    for (const c of s.controllers) safeSend(c, payload)
}

// ---------------------------------------------------------------------------
//  Core WS Handling
// ---------------------------------------------------------------------------

wss.on('connection', (socket) => {
  pendingControllers.add(socket)

  relayHello(socket)

  // Immediately broadcast TV list
  safeSend(socket, {
    type: MessageType.TV_LIST,
    msg: { screen: Screen.LOBBY, list: Array.from(sessions.keys()) },
    t: now()
  })

  socket.on('message', (raw) => {
    let payload: Payload
    try {
      payload = JSON.parse(raw.toString())
      // console.log(payload)
    } catch {
      safeSend(socket, {
        type: MessageType.RELAY_ERROR,
        msg: { reason: 'INVALID_JSON' },
        t: now()
      })
      return
    }

    const { type, msg } = payload
    console.log(payload)
    if (!type || !msg) return
    const session = msg.session

    // ---------------- TV REGISTER ------------------
    if (type === MessageType.REGISTER_TV) {
      if (!session) {
        safeSend(socket, {
          type: MessageType.RELAY_ERROR,
          msg: { reason: 'MISSING_SESSION' },
          t: now()
        })
        return
      }

      const old = sessions.get(session)
      if (old?.tv && old.tv !== socket) old.tv.close(1012, 'TV replaced')

      sessions.set(session, { tv: socket, controllers: new Set() })
      pendingControllers.delete(socket)

      safeSend(socket, {
        type: MessageType.ACK_TV,
        msg: { session },
        t: now()
      })

      console.info(`[relay] TV registered: ${session}`)
      broadcastTVList()
      return
    }

    // ---------------- CONTROLLER REGISTER ------------------
    if (type === MessageType.REGISTER_PLAYER) {
      if (!session) {
        safeSend(socket, {
          type: MessageType.NO_SESSION,
          msg: {},
          t: now()
        })
        return
      }

      const s = sessions.get(session)
      if (!s) {
        safeSend(socket, {
          type: MessageType.NO_SESSION,
          msg: { session },
          t: now()
        })
        return
      }

      s.controllers.add(socket)
      pendingControllers.delete(socket)

      safeSend(socket, {
        type: MessageType.ACK_PLAYER,
        msg: { session },
        t: now()
      })

      safeSend(s.tv, {
        type: MessageType.PLAYER_JOINED,
        msg: { session, id: msg.id, name: msg.name },
        t: now()
      })

      console.info(`[relay] Controller ${msg.id} joined ${session}`)
      return
    }

    // ---------------- KEEP ALIVE ------------------
    if (type === MessageType.RELAY_PONG || type === MessageType.PONG) return
    if (type === MessageType.PING) {
      safeSend(socket, {
        type: MessageType.PONG,
        msg: {},
        t: now()
      })
      return
    }

    // ---------------- SESSION ROUTING ------------------
    if (!session) return
    const s = sessions.get(session)
    if (!s) return

    // TV → controllers
    if (socket === s.tv) {
      for (const c of s.controllers) safeSend(c, payload)
      return
    }

    // Controller → TV
    safeSend(s.tv, payload)
  })

  // -------------------------------------------------------------------------
  // Cleanup
  // -------------------------------------------------------------------------

  socket.on('close', () => {
    pendingControllers.delete(socket)

    for (const [code, s] of sessions) {
      if (s.tv === socket) {
        sessions.delete(code)
        console.info(`[relay] TV closed ${code}`)

        for (const c of s.controllers)
          safeSend(c, {
            type: MessageType.PLAYER_LEFT,
            msg: { session: code, reason: 'TV_DISCONNECTED' },
            t: now()
          })

        broadcastTVList()
      } else if (s.controllers.delete(socket)) {
        console.info(`[relay] Controller left ${code}`)

        safeSend(s.tv, {
          type: MessageType.PLAYER_LEFT,
          msg: { session: code },
          t: now()
        })
      }
    }
  })
})

wss.on('error', (err) => console.error('[relay] error', err))
