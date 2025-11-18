import type { Model, Msg } from './types.js'

export const update = (msg: Msg, model: Model, _dispatch: any) => {
  switch (msg.type) {
    case 'NETWORK_IN': {
      const p = msg.payload
      if (p.type === 'ACK_PLAYER') {
        return { model: { ...model, connected: true }, effects: [] }
      }
      return { model, effects: [] }
    }
    default:
      return { model, effects: [] }
  }
}
