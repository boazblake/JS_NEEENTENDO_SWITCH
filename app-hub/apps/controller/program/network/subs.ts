import { sub } from 'algebraic-fx'
import type { ControllerEnv } from '../env'
import type { NetworkModel } from './types'
import type { Payload } from '@shared/types'

let socket: WebSocket | null = null

export const wsSub = (model: NetworkModel) => {
  if (!model.url) return []

  return [
    sub<ControllerEnv, Payload>('controller:ws', (env, dispatch) => {
      const ws = env.makeWebSocket(model.url)
      socket = ws

      ws.onmessage = (e) => {
        dispatch(JSON.parse(String(e.data)) as Payload)
      }

      ws.onclose = () => {
        socket = null
      }

      ws.onerror = () => {
        socket = null
      }

      return () => {
        ws.close()
        socket = null
      }
    })
  ]
}

export const send = (payload: Payload) => {
  if (!socket || socket.readyState !== WebSocket.OPEN) return
  socket.send(JSON.stringify(payload))
}
