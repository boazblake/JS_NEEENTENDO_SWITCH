import { sendMsg } from '@/effects/network.js'
import type { Model, Msg } from './types.js'

export const update = (msg: Msg, model: Model, _dispatch: (m: Msg) => void) => {
  switch (msg.type) {
    case 'NETWORK_IN': {
      console.log('next', msg)
      const p = msg.payload

      // controller join
      if (p.type === 'REGISTER_PLAYER') {
        const slot = Object.keys(model.players).length + 1
        const player = { id: p.id, name: p.name, slot }
        const next = { ...model, players: { ...model.players, [p.id]: player } }
        console.log('next', next)

        return {
          model: next,
          effects: [
            // describe the effect; Reader<DomEnv, IO>
            sendMsg({
              session: model.session,
              type: 'ACK_PLAYER',
              id: p.id,
              slot
            })
          ]
        }
      }

      // ack from relay confirming session ready
      if (p.type === 'SESSION_READY') {
        return { model: { ...model, status: 'connected' }, effects: [] }
      }

      return { model, effects: [] }
    }

    case 'SESSION_READY':
      return { model: { ...model, status: 'connected' }, effects: [] }

    default:
      return { model, effects: [] }
  }
}
