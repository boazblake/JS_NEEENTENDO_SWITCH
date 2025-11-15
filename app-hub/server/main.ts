import { WebSocketServer, WebSocket } from 'ws'

/**
 * Relay server for Nexus Arcade.
 *  - Each TV registers a session code (REGISTER_TV)
 *  - Controllers join a session (REGISTER_PLAYER)
 *  - All other messages are routed between them
 *  - Everything crossing the network is wrapped in
 *      { type: 'NETWORK_IN', payload }
 */

type Session = {
  tv: WebSocket
  controllers: Set<WebSocket>
}

const wss = new WebSocketServer({ port: 8081 })
const sessions = new Map<string, Session>()

console.log('[relay] listening on ws://localhost:8081')

const safeSend = (ws: WebSocket | undefined, data: any) => {
  if (!ws || ws.readyState !== WebSocket.OPEN) return
  ws.send(JSON.stringify(data))
}

const wrap = (payload: any) => ({ type: 'NETWORK_IN', payload })

wss.on('connection', (socket) => {
  console.log('[relay] new connection')

  socket.on('message', (raw) => {
    let msg: any
    try {
      msg = JSON.parse(raw.toString())
    } catch {
      console.warn('[relay] invalid JSON')
      return
    }

    const { type, session } = msg
    console.log(type, session)
    if (!type) return

    // --- 1. TV registers its session ----------------------------
    if (type === 'REGISTER_TV') {
      if (!session) return
      // Replace old TV for same code if needed
      const old = sessions.get(session)
      if (old?.tv && old.tv !== socket) old.tv.close(1012, 'TV replaced')

      sessions.set(session, { tv: socket, controllers: new Set() })
      console.log(`[relay] TV registered ${session}`)
      safeSend(socket, { type: 'SESSION_READY', session })
      return
    }

    // --- 2. Controller joins existing session -------------------
    if (type === 'REGISTER_PLAYER') {
      if (!session) return
      const s = sessions.get(session)
      if (!s) {
        safeSend(socket, { type: 'NO_SESSION', session })
        console.warn(`[relay] Controller tried invalid session ${session}`)
        return
      }
      s.controllers.add(socket)
      console.log(`[relay] Controller joined ${session}`)
      safeSend(socket, { type: 'JOINED', session })
      // Notify TV
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
          safeSend(c, { type: 'SESSION_CLOSED', session: code })
      } else if (s.controllers.delete(socket)) {
        console.log(`[relay] Controller left ${code}`)
      }
    }
  })
})

wss.on('error', (err) => console.error('[relay] error', err))
