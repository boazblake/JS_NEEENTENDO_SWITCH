// controller/update.ts
import type { Dispatch } from 'algebraic-js'
import type { ControllerModel, ControllerCtx } from './types'
import { sendMsg } from '@effects/network'
import { MessageType, type Payload, WordPondMsg } from '@shared/types'

import { program as Lobby } from './lobby'
import { program as Menu } from './menu'
import { program as Calibration } from './calibration'
import { program as Spray } from './spray-can'
import { program as WordPond } from './word-pond'
import { program as Driving } from './driving'
import { program as PacMan } from './pac-man'
import { startAutoCalibration } from './effects'

const routeSubProgram = (
  msg: Payload,
  model: ControllerModel,
  dispatch: Dispatch
) => {
  const ctx: ControllerCtx = model
  const screen = msg.msg.screen as ControllerModel['screen']

  switch (screen) {
    case 'lobby': {
      const r = Lobby.update(msg, model.lobby, dispatch, ctx)
      return { model: { ...model, lobby: r.model }, effects: r.effects }
    }
    case 'menu': {
      const r = Menu.update(msg, model.menu, dispatch, ctx)
      return { model: { ...model, menu: r.model }, effects: r.effects }
    }
    case 'calibration': {
      const r = Calibration.update(msg, model.calibration, dispatch, ctx)
      return { model: { ...model, calibration: r.model }, effects: r.effects }
    }
    case 'spraycan': {
      const r = Spray.update(msg, model.spray, dispatch, ctx)
      return { model: { ...model, spray: r.model }, effects: r.effects }
    }
    case 'driving': {
      const r = Driving.update(msg, model.driving, dispatch, ctx)
      return { model: { ...model, driving: r.model }, effects: r.effects }
    }

    case 'pacman': {
      const r = PacMan.update(msg, model.pacman, dispatch, ctx)
      return { model: { ...model, pacman: r.model }, effects: r.effects }
    }
    case 'wordpond': {
      const r = WordPond.update(msg, model.wordpond, dispatch, ctx)
      return { model: { ...model, wordpond: r.model }, effects: r.effects }
    }
    default:
      return { model, effects: [] }
  }
}

export const update = (
  payload: Payload,
  model: ControllerModel,
  dispatch: Dispatch
) => {
  switch (payload.type) {
    case MessageType.ACK_PLAYER: {
      const { id, session } = model
      const effects = [startAutoCalibration(dispatch, id, session)]
      return {
        model: { ...model, status: 'connected', screen: 'menu' },
        effects
      }
    }

    case 'PACMAN_SET_DIR':
      return { model: { ...model, dir: msg.msg.dir }, effects: [] }

    case MessageType.TV_LIST:
      return routeSubProgram(payload, model, dispatch)

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

    case MessageType.POINTER_HOVER: {
      const hoveredId = payload.msg.hoveredId || null
      return { model: { ...model, hoveredId }, effects: [] }
    }

    case MessageType.SCREEN_SELECTED:
      return {
        model: { ...model, screen: payload.msg.screen },
        effects: []
      }

    case MessageType.NAVIGATE: {
      const screen = payload.msg.screen as ControllerModel['screen']
      const next = { ...model, screen }

      const fx = sendMsg({
        type: MessageType.NAVIGATE,
        msg: { session: model.session, screen, id: model.id },
        t: Date.now()
      })

      return { model: next, effects: [fx] }
    }

    case 'WORDPOND_SHAKE': {
      const shakeMsg: Payload = {
        type: WordPondMsg.SHAKE,
        msg: {
          ...payload.msg,
          session: model.session,
          id: model.id
        },
        t: Date.now()
      }

      const sendFx = sendMsg(shakeMsg)
      const ctx: ControllerCtx = model
      const r = WordPond.update(payload, model.wordpond, dispatch, ctx)

      return {
        model: { ...model, wordpond: r.model },
        effects: [sendFx, ...r.effects]
      }
    }

    case MessageType.SPRAY_START:
    case MessageType.SPRAY_POINT:
    case MessageType.SPRAY_END: {
      const graffiti: Payload = {
        type: payload.type,
        msg: {
          ...payload.msg,
          session: model.session,
          id: model.id
        },
        t: Date.now()
      }

      const sendFx = sendMsg(graffiti)

      const ctx: ControllerCtx = model
      const r = Spray.update(payload, model.spray, dispatch, ctx)
      return {
        model: { ...model, spray: r.model },
        effects: [sendFx, ...r.effects]
      }
    }

    default: {
      if (payload?.msg?.screen) return routeSubProgram(payload, model, dispatch)
      return { model, effects: [] }
    }
  }
}
