import type { Dispatch } from 'algebraic-js'
import type { Model } from './types'
import { sendMsg } from '@effects/network'
import { createMsg, withIds } from '@shared/utils'
import { program as Lobby } from './lobby/index'
import { program as Menu } from './menu/index'
import { program as Calibration } from './calibration/index'
import { program as Spray } from './spray-can/index'
import { startAutoCalibration } from './effects'
import { MessageType, Screen, type Payload } from '@shared/types'

const routeSubProgram = (msg: Payload, model: Model, dispatch: Dispatch) => {
  switch (msg.msg.screen) {
    case Screen.LOBBY: {
      const r = Lobby.update(msg, model.lobby, dispatch)
      return { model: { ...model, lobby: r.model }, effects: r.effects }
    }
    case Screen.MENU: {
      const r = Menu.update(msg, model.menu, dispatch)
      return { model: { ...model, menu: r.model }, effects: r.effects }
    }
    case Screen.CALIBRATION: {
      const r = Calibration.update(msg, model.calibration, dispatch)
      return { model: { ...model, calibration: r.model }, effects: r.effects }
    }
    case Screen.SPRAYCAN: {
      const r = Spray.update(msg, model.spray, dispatch)
      return { model: { ...model, spray: r.model }, effects: r.effects }
    }
    default:
      return { model, effects: [] }
  }
}

export const update = (payload: Payload, model: Model, dispatch: Dispatch) => {
  switch (payload.type) {
    // -----------------------------------------------------------------------
    //  Relay confirms registration
    // -----------------------------------------------------------------------
    case MessageType.ACK_PLAYER: {
      const { id, session } = model
      const effects = [startAutoCalibration(dispatch, id, session)]
      return {
        model: { ...model, status: 'connected', screen: Screen.MENU },
        effects
      }
    }

    // -----------------------------------------------------------------------
    //  Relay broadcasts available TVs
    // -----------------------------------------------------------------------
    case MessageType.TV_LIST:
      return routeSubProgram(payload, model, dispatch)

    // -----------------------------------------------------------------------
    //  Controller selects a TV
    // -----------------------------------------------------------------------
    case 'SELECT_TV': {
      const tvId = payload.msg.tvId
      const next = { ...model, session: tvId, status: 'connecting' }
      return {
        model: next,
        effects: [
          sendMsg({
            type: MessageType.REGISTER_PLAYER,
            msg: { session: tvId, id: model.id, name: model.name },
            t: Date.now()
          })
        ]
      }
    }

    // -----------------------------------------------------------------------
    //  Hover feedback from TV
    // -----------------------------------------------------------------------
    case MessageType.POINTER_HOVER: {
      const hoverId = payload.msg.id || null
      console.log('hover', hoverId)
      return { model: { ...model, hoverId }, effects: [] }
    }

    case 'APP_SELECTED':
      return { model: { ...model, screen: payload.msg.app }, effects: [] }

    case MessageType.SPRAY_START:
    case MessageType.SPRAY_POINT:
    case MessageType.SPRAY_END: {
      const graffiti = {
        type: payload.type,
        msg: {
          ...payload.msg,
          session: model.session,
          id: model.id
        },
        t: Date.now()
      }

      // 1. send to the relay
      const sendFx = sendMsg(graffiti)

      // 2. update local spray child model
      const r = Spray.update(payload, model.spray, dispatch)

      return {
        model: { ...model, spray: r.model },
        effects: [sendFx, ...r.effects]
      }
    }

    // -----------------------------------------------------------------------
    //  Fallback: route by screen key
    // -----------------------------------------------------------------------
    default: {
      if (payload?.msg?.screen) return routeSubProgram(payload, model, dispatch)
      return { model, effects: [] }
    }
  }
}
