import type { Payload } from '@shared/types'
import type { NetworkMsg } from './network'
import * as Network from './network'
import { splitRoute } from '@shared/utils'
import { MessageDomain } from '@shared/types'
import { send } from './network'

export const update = (
  payload: Payload | NetworkMsg | { type: 'SELECT_TV'; session: string },
  model: Model
) => {
  console.log(payload.type)
  // ---- NETWORK CONTROL (THIS WAS MISSING) ----
  if (
    payload.type === 'Enable' ||
    payload.type === 'Connected' ||
    payload.type === 'Disconnected'
  ) {
    const next = Network.update(payload as NetworkMsg, model.network)
    return {
      model: { ...model, network: next.model },
      effects: next.effects
    }
  }

  // ---- USER INTENT ----
  if (payload.type === 'SELECT_TV') {
    return {
      model: { ...model, session: payload.msg.session },
      effects: [
        send({
          type: 'NETWORK.REGISTER',
          msg: {
            role: 'CONTROLLER',
            id: model.name,
            session: payload.msg.session
          },
          t: Date.now()
        })
      ]
    }
  }

  // ---- NETWORK PAYLOAD (FLAT) ----

  const { domain, rest } = splitRoute(payload.type)

  if (domain === MessageDomain.Network) {
    return { model, effects: [] }
  }

  if (domain === MessageDomain.LOBBY && rest === 'TV_LIST') {
    return {
      model: {
        ...model,
        lobby: {
          ...model.lobby,
          availableTvs: payload.msg.list
        }
      },
      effects: []
    }
  }

  return { model, effects: [] }
}
