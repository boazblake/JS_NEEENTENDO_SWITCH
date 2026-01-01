import type { Payload } from '@shared/types'
import type { NetworkMsg } from './network'
import * as Network from './network'
import { splitRoute } from '@shared/utils'
import { MessageDomain } from '@shared/types'
import { send } from './network'
import { update as updateCalibration } from './calibration/update'
import { update as updateLobby } from './lobby/update'
import { routeByDomain } from './router'

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

  if (payload.type === 'SELECT_TV') {
    send({
      type: 'NETWORK.REGISTER',
      msg: {
        role: 'CONTROLLER',
        id: model.name,
        session: payload.msg.session
      },
      t: Date.now()
    })

    return {
      model: { ...model, session: payload.session },
      effects: []
    }
  }

  // DOMAIN ROUTING (Phase 3)
  return routeByDomain(payload, model, {
    [MessageDomain.NETWORK]: () => ({ model, effects: [] }),

    [MessageDomain.LOBBY]: (p, m) => {
      const r = lobbyUpdate(p, m.lobby)
      return { model: { ...m, lobby: r.model }, effects: r.effects }
    },

    [MessageDomain.CALIBRATION]: (p, m) => {
      const r = updateCalibration(p, m.calibration)
      return {
        model: { ...m, calibration: r.model },
        effects: r.effects
      }
    }
  })

  return { model, effects: [] }
}
