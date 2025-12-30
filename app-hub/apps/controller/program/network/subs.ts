import { sub } from 'algebraic-fx'
import type { NetworkModel, NetworkMsg } from './types'
import type { ControllerEnv } from '../env'

export const wsSub = (model: NetworkModel) => {
  if (!model.url) return []

  return [
    sub<ControllerEnv, NetworkMsg>('controller:ws', (env, dispatch) => {
      const ws = env.makeWebSocket(model.url)

      ws.onopen = () => dispatch({ type: 'Connected' })

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
