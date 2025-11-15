import { IO } from 'algebraic-js'
import type { Model, Msg } from './types.js'
import { sendIO } from '@/effects/network'

export const update = (
  msg: Msg,
  model: Model,
  _dispatch: (m: Msg) => void,
  ws: WebSocket
) => {
  switch (msg.type) {
    case 'UNREGISTER_PLAYER':
      return {
        model,
        effects: [
          sendIO(
            ws,
            JSON.stringify({
              type: 'UNREGISTER_PLAYER',
              id: msg.id
            })
          )
        ]
      }
    case 'REGISTER_PLAYER':
      return {
        model: { ...model, id: msg.id },
        effects: [
          sendIO(
            ws,
            JSON.stringify({
              type: 'REGISTER_PLAYER',
              id: msg.id,
              name: msg.name
            })
          )
        ]
      }

    case 'NETWORK_IN': {
      const p = JSON.parse(msg.payload)
      if (p.type === 'ACK_PLAYER' && p.id === model.id) {
        return { model: { ...model, slot: p.slot }, effects: [] }
      }
      if (p.type === 'STATE_SYNC') {
        console.log(p)
        return { model: { ...model, state: p.state }, effects: [] }
      }
      return { model, effects: [] }
    }

    default:
      return { model, effects: [] }
  }
}
