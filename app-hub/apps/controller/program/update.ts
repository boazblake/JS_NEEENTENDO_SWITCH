import type { Payload } from '@shared/types'
import type { Dispatch } from 'algebraic-fx'
import type { NetworkMsg } from './network'
import * as Network from './network'
import { splitRoute } from '@shared/utils'
import { MessageDomain } from '@shared/types'
import { send } from './network'
import { program as Calibration } from './calibration'
import { program as Lobby } from './lobby'
import { routeByDomain } from './router'

export const update = (
  payload: Payload | NetworkMsg | { type: 'SELECT_TV'; session: string },
  model: Model,
  dispatch: Dispatch
) => {
  console.log(payload)
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
      model: { ...model, session: payload.msg.session },
      effects: []
    }
  }

  if (payload.type === 'NETWORK.SENSOR.MOTION') {
    // console.log(payload)
    send(payload)
  }

  // DOMAIN ROUTING (Phase 3)
  return routeByDomain(payload, model, {
    [MessageDomain.NETWORK]: (p, m) => {
      if (p.type === 'ACK') {
        dispatch({ type: `CALIBRATION.ENABLE_MOTION` })
        model.screen = 'menu'
      }

      return { model, effects: [] }
    },

    [MessageDomain.LOBBY]: (p, m) => {
      const r = Lobby.update(p, m.lobby, dispatch)
      return { model: { ...m, lobby: r.model }, effects: r.effects }
    },

    [MessageDomain.CALIBRATION]: (p, m) => {
      const r = Calibration.update(p, m.calibration, dispatch, model)
      return {
        model: { ...m, calibration: r.model },
        effects: r.effects
      }
    }
  })

  return { model, effects: [] }
}
