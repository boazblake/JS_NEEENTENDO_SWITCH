import { MessageType } from '@shared/types'
import type { Model, Msg } from './types'
import * as Network from './network'

import { IO } from 'algebraic-fx'

export const update = (msg: Msg, model: Model) => {
  // Network wrapper
  console.log(msg)
  if (msg.type === 'Network') {
    const next = Network.update(msg.msg, model.network)

    if (msg.msg.type === 'Inbound') {
      const payload = msg.msg.msg

      if (payload.type === MessageType.TV_LIST) {
        console.log(model)
        model.lobby.availableTvs = payload.msg.list
        return {
          model,
          effects: []
        }
      }
    }

    return {
      model: { ...model, network: next.model },
      effects: next.effects
    }
  }

  // User selects a TV
  if (msg.type === 'SELECT_TV') {
    return {
      model: { ...model, session: msg.session },
      effects: [
        IO.IO(() => ({
          type: 'Network',
          msg: {
            type: 'Inbound',
            msg: {
              type: MessageType.REGISTER_PLAYER,
              msg: { session: msg.session }
            }
          }
        }))
      ]
    }
  }

  return { model, effects: [] }
}
