import { IO } from 'algebraic-js'
import { sendMsg } from '@effects/network'
import {
  MessageType,
  RegisterPlayer,
  AckPlayer,
  AppSelected,
  NetworkIn,
  ScreenOut,
  Screen
} from '@shared/types'
import { wrapScreenIn } from '@shared/utils'

import { program as Lobby } from './lobby/index.js'
import { program as Menu } from './menu/index.js'
import { program as Calibration } from './calibration/index.js'
import { program as Spray } from './spray-can/index.js'
import type { Model, Msg } from './types.js'

/* -------------------------------------------------------------
 * handleNetwork – inbound network messages
 * ------------------------------------------------------------- */
const handleNetwork = (payload: any, model: Model, dispatch: any) => {
  switch (payload.type) {
    /* ---------- TV session / player registration ---------- */
    case MessageType.REGISTER_PLAYER: {
      const p = payload as RegisterPlayer
      const slot = Object.keys(model.players).length + 1
      const player = { id: p.id!, name: p.name, slot }
      const nextPlayers = { ...model.players, [p.id!]: player }

      const ack: AckPlayer = {
        type: MessageType.ACK_PLAYER,
        session: model.session,
        id: p.id!,
        slot
      }

      return {
        model: { ...model, players: nextPlayers, status: 'connected' },
        effects: [sendMsg(ack)]
      }
    }

    /* ---------- Namespaced sub-program envelope ---------- */
    case MessageType.SCREEN_OUT: {
      // This came from a controller sub-program (e.g., calibration)
      const { screen, payload: inner } = payload as ScreenOut
      dispatch(wrapScreenIn(screen, inner))
      return { model, effects: [] }
    }

    /* ---------- Other network messages ---------- */
    default:
      return { model, effects: [] }
  }
}

/* -------------------------------------------------------------
 * routeSubProgram – internal TV sub-apps
 * ------------------------------------------------------------- */
const routeSubProgram = (msg: Msg, model: Model, dispatch: any) => {
  switch (msg.screen) {
    case Screen.LOBBY: {
      const r = Lobby.update(msg, model.lobby, (m: any) =>
        dispatch({ type: Screen.LOBBY, msg: m })
      )
      return { model: { ...model, lobby: r.model }, effects: r.effects }
    }

    case Screen.MENU: {
      const r = Menu.update(msg, model.menu, (m: any) =>
        dispatch({ type: Screen.MENU, msg: m })
      )
      return { model: { ...model, menu: r.model }, effects: r.effects }
    }

    case Screen.CALIBRATION: {
      const r = Calibration.update(msg, model.calibration, (m: any) =>
        dispatch({ type: Screen.CALIBRATION, msg: m })
      )
      // return { model: { ...model, calibration: r.model }, effects: r.effects }
    }

    case Screen.SPRAYCAN: {
      const r = Spray.update(msg, model.spray, (m: any) =>
        dispatch({ type: Screen.SPRAYCAN, msg: m })
      )
      return { model: { ...model, spray: r.model }, effects: r.effects }
    }

    default:
      return { model, effects: [] }
  }
}

/* -------------------------------------------------------------
 * Parent update
 * ------------------------------------------------------------- */
export const update = (msg: Msg, model: Model, dispatch: any) => {
  switch (msg.type) {
    case MessageType.NETWORK_IN: {
      const payload = (msg as NetworkIn).payload

      // 1. If payload itself is a ScreenOut → sub-program event
      // 2. Otherwise treat as top-level network message
      if (payload.type === MessageType.SCREEN_OUT) {
        const { screen, payload: inner } = payload as ScreenOut
        dispatch(wrapScreenIn(screen, inner))
        return { model, effects: [] }
      }

      // top-level controller → relay → TV messages
      const { model: next, effects } = handleNetwork(payload, model, dispatch)
      return { model: next, effects }
    }

    /* ---------- Local navigation ---------- */
    case MessageType.NAVIGATE: {
      const next = { ...model, screen: msg.to }

      const appSelected: AppSelected = {
        type: MessageType.APP_SELECTED,
        session: model.session,
        app: msg.to
      }

      return { model: next, effects: [sendMsg(appSelected)] }
    }

    /* ---------- Delegate to child programs ---------- */
    default:
      return routeSubProgram(msg, model, dispatch)
  }
}
