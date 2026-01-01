import type { Effect } from 'algebraic-fx'

let ws: WebSocket | null = null

export const registerSocket = (socket: WebSocket) => {
  ws = socket
}

export const clearSocket = () => {
  ws = null
}

export type NetworkEffect = {
  _tag: 'NetworkEffect'
  type: string
  msg: Record<string, unknown>
  t: number
}

export const networkEffect: Effect<any, any> = {
  run(_env, _dispatch, effect: NetworkEffect) {
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      console.error('NetworkEffect: no active socket')
      return
    }
    ws.send(JSON.stringify({ type: effect.type, msg: effect.msg, t: effect.t }))
  }
}
