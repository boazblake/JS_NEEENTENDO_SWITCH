import { WebSocketServer, WebSocket } from 'ws'
import https from 'https'
import path from 'path'
import { readFileSync } from 'fs'

import {
  MessageType,
  BaseMessage,
  NetworkIn,
  RegisterTV,
  RegisterPlayer
} from '@/shared/types.js'

/**
 * Relay server for Nexus Arcade.
 *  - TVs register a session code (REGISTER_TV)
 *  - Controllers join a session (REGISTER_PLAYER)
 *  - All other messages are routed between them
 *  - Every forwarded message is wrapped in
 *      { type: MessageType.NETWORK_IN, payload }
 */

type Session = {
  tv: WebSocket
  controllers: Set<WebSocket>
}

const certDir = process.cwd()
const key = readFileSync(path.join(certDir, '192.168.7.195+2-key.pem'))
const cert = readFileSync(path.join(certDir, '192.168.7.195+2.pem'))
const server = https.createServer({ key, cert })
const wss = new WebSocketServer({ server })

server.listen(8081, '0.0.0.0', () =>
  console.log('[relay] HTTPS+WSS listening on 8081')
)

const sessions = new Map<string, Session>()

// ---------------------------------------------------------------------------
// Utility helpers
// ---------------------------------------------------------------------------

const safeSend = (ws: WebSocket | undefined, data: BaseMessage) => {
  if (!ws || ws.readyState !== WebSocket.OPEN) return
  ws.send(JSON.stringify(data))
}

const wrap = (payload: BaseMessage): NetworkIn => ({
  type: MessageType.NETWORK_IN,
  payload
})

// ---------------------------------------------------------------------------
// Connection handling
// ---------------------------------------------------------------------------

wss.on('connection', (socket) => {
  console.log('[relay] new connection')

  socket.on('message', (raw) => {
    let msg: BaseMessage
    try {
      msg = JSON.parse(raw.toString())
    } catch {
      console.warn('[relay] invalid JSON')
      return
    }

    const { type, session } = msg
    if (!type) return

    // --- 1. TV registers its session ----------------------------
    if (type === MessageType.REGISTER_TV) {
      const payload = msg as RegisterTV
      if (!payload.session) return

      const { session } = payload
      const old = sessions.get(session)
      if (old?.tv && old.tv !== socket) old.tv.close(1012, 'TV replaced')

      sessions.set(session, { tv: socket, controllers: new Set() })
      console.log(`[relay] TV registered ${session}`)

      safeSend(socket, { type: MessageType.APP_SELECTED, session })
      return
    }

    // --- 2. Controller joins existing session -------------------
    if (type === MessageType.REGISTER_PLAYER) {
      const payload = msg as RegisterPlayer
      if (!payload.session) return

      const s = sessions.get(payload.session)
      if (!s) {
        safeSend(socket, {
          type: MessageType.ERROR,
          session: payload.session,
          message: MessageType.NO_SESSSION
        } as any)
        console.warn(`[relay] invalid session ${payload.session}`)
        return
      }

      s.controllers.add(socket)
      console.log(`[relay] Controller joined ${payload.session}`)
      safeSend(socket, {
        type: MessageType.ACK_PLAYER,
        session: payload.session
      } as any)

      // Notify TV that a controller joined
      safeSend(s.tv, wrap(msg))
      return
    }

    // --- 3. Route everything else -------------------------------
    if (!session) return
    const s = sessions.get(session)
    if (!s) return

    // TV → Controllers
    if (socket === s.tv) {
      for (const c of s.controllers) safeSend(c, wrap(msg))
      return
    }

    // Controller → TV
    safeSend(s.tv, wrap(msg))
  })

  // --- 4. Cleanup -----------------------------------------------
  socket.on('close', () => {
    for (const [code, s] of sessions) {
      if (s.tv === socket) {
        sessions.delete(code)
        console.log(`[relay] TV closed ${code}`)
        for (const c of s.controllers)
          safeSend(c, {
            type: MessageType.ERROR,
            session: code,
            message: 'SESSION_CLOSED'
          } as any)
      } else if (s.controllers.delete(socket)) {
        console.log(`[relay] Controller left ${code}`)
      }
    }
  })
})

wss.on('error', (err) => console.error('[relay] error', err))
