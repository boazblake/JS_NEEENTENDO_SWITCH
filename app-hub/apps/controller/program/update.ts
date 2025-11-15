import type { Model, Msg } from './types.js'

export const update = (msg: Msg, model: Model, _dispatch: (m: Msg) => void) => {
  switch (msg.type) {
    case 'NETWORK_IN': {
      const p = msg.payload
      if (p.type === 'ACK_PLAYER' && p.id === model.id) {
        return {
          model: { ...model, slot: p.slot, status: 'connected' },
          effects: []
        }
      }
      return { model, effects: [] }
    }

    case 'JOINED':
      return { model: { ...model, status: 'connected' }, effects: [] }

    default:
      return { model, effects: [] }
  }
}
