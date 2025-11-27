import { WebSocketServer, WebSocket } from 'ws'
import https from 'https'
import path from 'path'
import { readFileSync } from 'fs'
import { MessageType, Screen, type Payload } from '../../../shared/src/types.ts'

// ---------------------------------------------------------------------------
//  Session tracking
// ---------------------------------------------------------------------------

type Session = {
  tv: WebSocket
  controllers: Set<WebSocket>
}

const sessions = new Map<string, Session>()

// Controllers connected but not yet joined to a TV session
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
  console.info('[relay] HTTPS+WSS listening on https://192.168.7.195:8081')
)

// ---------------------------------------------------------------------------
//  Helpers
// ---------------------------------------------------------------------------

const isOpen = (ws: WebSocket) => ws.readyState === WebSocket.OPEN

const safeSend = (ws: WebSocket | undefined, payload: Payload) => {
  // console.warn('sending: ', payload)
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

// Send updated TV list to all controllers (pending + attached)
const broadcastTVList = (): void => {
  const tvList = Array.from(sessions.keys())
  const payload: Payload = {
    type: MessageType.TV_LIST,
    msg: { screen: Screen.LOBBY, list: tvList },
    t: now()
  }

  // pending controllers (not in any session yet)
  for (const c of pendingControllers) if (isOpen(c)) safeSend(c, payload)

  // controllers already attached to a session
  for (const s of sessions.values())
    for (const c of s.controllers) if (isOpen(c)) safeSend(c, payload)
}

// ---------------------------------------------------------------------------
//  Core message handling
// ---------------------------------------------------------------------------

wss.on('connection', (socket) => {
  // treat as controller until proven otherwise
  pendingControllers.add(socket)

  relayHello(socket)

  // always send the current list to the newly connected client
  // this makes controllers show TVs immediately
  const currentList: Payload = {
    type: MessageType.TV_LIST,
    msg: { screen: Screen.LOBBY, list: Array.from(sessions.keys()) },
    t: now()
  }
  safeSend(socket, currentList)

  socket.on('message', (raw) => {
    let payload: Payload
    try {
      payload = JSON.parse(raw.toString())
    } catch {
      safeSend(socket, {
        type: MessageType.RELAY_ERROR,
        msg: { reason: 'INVALID_JSON' },
        t: now()
      })
      return
    }

    const { type, msg } = payload
    if (!type || !msg) return
    const session = msg.session

    // --- 1) TV registers a room -------------------------------------------
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
      // a TV is not a controller; remove if present
      pendingControllers.delete(socket)

      safeSend(socket, {
        type: MessageType.ACK_TV,
        msg: { session },
        t: now()
      })

      console.info(`[relay] TV registered: ${session}`)
      broadcastTVList() // notify all controllers (pending + attached)
      return
    }

    // --- 2) Controller joins after selecting TV ----------------------------
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

      // Notify TV about the new controller
      safeSend(s.tv, {
        type: MessageType.PLAYER_JOINED,
        msg: { session, id: msg.id, name: msg.name },
        t: now()
      })

      console.info(`[relay] Controller ${msg.id} joined ${session}`)
      return
    }

    // --- 3) Keepalive ------------------------------------------------------
    if (type === MessageType.RELAY_PONG || type === MessageType.PONG) return
    if (type === MessageType.PING) {
      safeSend(socket, { type: MessageType.PONG, msg: {}, t: now() })
      return
    }
    // --- 4) Route all other messages within the session --------------------
    if (!session) return
    const s = sessions.get(session)
    if (!s) return

    // TV → Controllers
    if (socket === s.tv) {
      for (const c of s.controllers) safeSend(c, payload)
      return
    }

    // Controller → TV

    safeSend(s.tv, payload)
  })

  // --- 5) Cleanup ----------------------------------------------------------
  socket.on('close', () => {
    pendingControllers.delete(socket)

    for (const [code, s] of sessions) {
      if (s.tv === socket) {
        sessions.delete(code)
        console.info(`[relay] TV closed ${code}`)
        for (const c of s.controllers)
          safeSend(c, {
            type: MessageType.DISCONNECT_PLAYER,
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
