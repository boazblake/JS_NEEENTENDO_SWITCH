import type { Dispatch } from 'algebraic-js'
import type { Model, Msg } from './types.js'
import { sendMsg } from '@effects/network'
import { program as Lobby } from './lobby/index.js'
import { program as Menu } from './menu/index.js'
import { program as Calibration } from './calibration/index.js'
import { program as Spray } from './spray-can/index.js'
import { MessageType, ScreenOut, Screen, NetworkIn } from '@shared/types'

export const routeSubProgram = (msg: Msg, model: Model, dispatch: Dispatch) => {
  switch (msg.type) {
    case Screen.LOBBY: {
      const r = Lobby.update(msg.msg, model.lobby, (m) =>
        dispatch({ type: Screen.LOBBY, msg: m })
      )
      return { model: { ...model, lobby: r.model }, effects: r.effects }
    }

    case Screen.MENU: {
      const r = Menu.update(msg.msg, model.menu, (m) =>
        dispatch({ type: Screen.MENU, msg: m })
      )
      return { model: { ...model, menu: r.model }, effects: r.effects }
    }

    case Screen.CALIBRATION: {
      const r = Calibration.update(msg.msg, model.calibration, (m) =>
        dispatch(m)
      )
      return { model: { ...model, calibration: r.model }, effects: r.effects }
    }

    case Screen.SPRAYCAN: {
      const r = Spray.update(msg.msg, model.spray, (m) =>
        dispatch({ type: Screen.SPRAYCAN, msg: m })
      )
      return { model: { ...model, spray: r.model }, effects: r.effects }
    }

    default:
      return { model, effects: [] }
  }
}
/**
 * Map an incoming network payload to a controller state change
 * or to a local sub-program message.
 */
export const handleNetwork = (payload: any, model: Model) => {
  switch (payload.type) {
    case 'ACK_PLAYER':
      return { model: { ...model, status: 'connected' }, effects: [] }

    case 'APP_SELECTED':
      return { model: { ...model, screen: payload.app }, effects: [] }

    case 'CALIB_UPDATE':
      // if the controller needs to reflect other players’ calibration
      return { model, effects: [] }

    case 'PING':
      // Example of replying back
      return {
        model,
        effects: [
          sendMsg({ type: 'PONG', id: model.id, session: model.session })
        ]
      }

    default:
      return { model, effects: [] }
  }
}

const handleScreenOut = (msg: ScreenOut, model: Model) => {
  const outMsg = { ...msg, id: model.id, session: model.session }
  return {
    model,
    effects: [sendMsg(outMsg)]
  }
}

export const update = (msg: Msg, model: Model, dispatch: any) => {
  switch (msg.type) {
    case MessageType.NETWORK_IN: {
      const { model: next, effects } = handleNetwork(
        (msg as NetworkIn).payload,
        model,
        dispatch
      )
      return { model: next, effects }
    }

    case MessageType.SCREEN_OUT:
      return handleScreenOut(msg as ScreenOut, model)

    default:
      return routeSubProgram(msg, model, dispatch)
  }
}
