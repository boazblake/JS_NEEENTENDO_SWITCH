import { sub } from 'algebraic-fx'
import type { TVEnv } from '../env'
import type { NetworkModel } from './types'
import type { Payload } from '@shared/types'
import { registerSocket, clearSocket } from '@/effects/network'

export const wsSub = (model: NetworkModel) => {
  if (!model.url) return []

  return [
    sub<TVEnv, Payload>('tv:ws', (env, dispatch) => {
      const ws = env.makeWebSocket(model.url)

      registerSocket(ws)

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

      ws.onclose = () => clearSocket()

      ws.onerror = () => {
        clearActiveSocket()
      }

      return () => {
        ws.close()
        clearActiveSocket()
      }
    })
  ]
}
