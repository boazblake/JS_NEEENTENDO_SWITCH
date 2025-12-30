import { sub } from 'algebraic-fx'
import { decode, isWireMsg } from '@shared/protocol'
import type { NetworkMsg, NetworkModel } from './types'
import type { TVEnv } from '../env'

import { MessageType } from '@shared/types'

export const wsSub = (model: NetworkModel) => {
  if (!model.url) return []

  return [
    sub<TVEnv, NetworkMsg>('tv:ws', (env, dispatch) => {
      const ws = env.makeWebSocket(model.url)

      ws.onopen = () => {
        console.log('[tv] ws open, registering', env.session)

        ws.send(
          JSON.stringify({
            type: MessageType.REGISTER_TV,
            msg: { session: env.session },
            t: Date.now()
          })
        )

        dispatch({ type: 'Connected' })
      }

      ws.onmessage = (e) => {
        dispatch({
          type: 'Inbound',
          msg: JSON.parse(String(e.data))
        })
      }

      ws.onclose = () => dispatch({ type: 'Disconnected' })
      ws.onerror = () => dispatch({ type: 'Disconnected' })

      return () => ws.close()
    })
  ]
}
