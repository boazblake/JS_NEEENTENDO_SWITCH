import { sub } from 'algebraic-fx'
import type { NetworkModel, NetworkMsg } from './types'

export type WsEnv = {
  makeWebSocket: (url: string) => WebSocket
}

export const wsSub = <Env extends WsEnv>(model: NetworkModel, tag: string) => {
  if (!model.url) return []

  return [
    sub<Env, NetworkMsg>(tag, (env, dispatch) => {
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
