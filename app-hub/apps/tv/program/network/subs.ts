import { sub } from 'algebraic-fx'
import type { TVEnv } from '../env'
import type { NetworkModel } from './types'
import type { Payload } from '@shared/types'

let socket: WebSocket | null = null

export const wsSub = (model: NetworkModel) => {
  if (!model.url) return []

  return [
    sub<TVEnv, Payload>('tv:ws', (env, dispatch) => {
      const ws = env.makeWebSocket(model.url)
      socket = ws

      ws.onopen = () => {
        ws.send(
          JSON.stringify({
            type: 'NETWORK.REGISTER',
            msg: {
              role: 'TV',
              id: env.session,
              session: env.session
            }
          })
        )
      }
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
