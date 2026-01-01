import type { Effect } from 'algebraic-fx'

export const socketEffect: Effect<any, any> = {
  run(env, dispatch) {
    const ws = env.ws
    setActiveSocket(ws)

    ws.onmessage = (e) => {
      const msg = JSON.parse(String(e.data))
      dispatch(msg)
    }

    ws.onerror = (e) => console.error('socket error', e)
    ws.onclose = () => clearActiveSocket()

    return () => {
      ws.close()
      clearActiveSocket()
    }
  }
}

let activeSocket: WebSocket | null = null

export const setActiveSocket = (ws: WebSocket) => {
  activeSocket = ws
}

export const clearActiveSocket = () => {
  activeSocket = null
}

export const getActiveSocket = () => activeSocket
