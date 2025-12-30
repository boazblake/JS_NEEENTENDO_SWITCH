import type { RawEffect, Dispatch } from 'algebraic-fx'
import { MessageType, WordPondMsg, type Payload } from '@shared/types'
import type { WireMsg } from '@shared/protocol'
import type { TVEnv } from './env'
import type { TVModel, TVContext, TVMsg } from './types'
import * as Network from './network'

import { orientationToXY } from './effects'

import { program as Lobby } from './lobby'
import { program as Menu } from './menu'
import { program as Calibration } from './calibration'
import { program as Spray } from './spray-can'
import { program as WordPond } from './word-pond'
import { program as PacMan } from './pac-man'
import { program as Driving } from './driving'

/* -------------------------------------------------- */
/* helpers                                            */
/* -------------------------------------------------- */

const dispatchEffect = (
  msg: TVMsg,
  dispatch: Dispatch
): RawEffect<TVEnv, TVMsg> => ({
  run: (_env) => dispatch(msg)
})

const wireToPayload = (wire: WireMsg): Payload => ({
  type: wire.type as any,
  msg: wire.msg as any
})

const makeCtx = (model: TVModel): TVContext => ({
  session: model.session,
  screenW: model.screenW,
  screenH: model.screenH,
  controllers: model.controllers,
  actions: model.actions,
  players: model.players
})

/* -------------------------------------------------- */
/* update                                             */
/* -------------------------------------------------- */

export const update = (msg: TVMsg, model: TVModel, dispatch: Dispatch) => {
  /* ---------- network wrapper ---------- */

  if (msg.type === 'Network') {
    const net = msg.msg

    if (net.type === 'Inbound') {
      return {
        model,
        effects: [dispatchEffect(wireToPayload(net.msg), dispatch)]
      }
    }

    const next = Network.update(net, model.network)
    return {
      model: { ...model, network: next.model },
      effects: next.effects
    }
  }

  if (msg.type === 'Shutdown') {
    return {
      model: { ...model, network: { status: 'off' } },
      effects: []
    }
  }

  /* ---------- legacy payload ---------- */

  const payload = msg as Payload
  const ctx = makeCtx(model)

  switch (payload.type) {
    case MessageType.RELAY_HELLO:
      return { model, effects: [] }

    case MessageType.NAVIGATE: {
      const screen = payload.msg.screen as TVModel['screen']
      return {
        model: { ...model, screen },
        effects: []
      }
    }

    case 'ACTIONS_REGISTERED':
      return {
        model: { ...model, actions: payload.msg.actions || [] },
        effects: []
      }

    case MessageType.CALIB_UPDATE: {
      const { id, q, g } = payload.msg

      const controller = model.controllers[id] ?? {
        pointer: {
          x: model.screenW / 2,
          y: model.screenH / 2,
          hoveredId: null
        },
        player: null,
        spraying: false
      }

      const pointer = controller.pointer

      const [x, y] = orientationToXY(q, g, model.screenW, model.screenH, {
        invertX: true,
        invertY: true,
        dead: 0.03
      })

      const smooth = (a: number, b: number, f = 0.15) => a + (b - a) * f
      const xs = smooth(pointer.x ?? x, x)
      const ys = smooth(pointer.y ?? y, y)

      let hoveredId: string | null = null
      for (const a of model.actions) {
        if (
          xs >= a.rect.x &&
          xs <= a.rect.x + a.rect.w &&
          ys >= a.rect.y &&
          ys <= a.rect.y + a.rect.h
        ) {
          hoveredId = a.id
          break
        }
      }

      const nextControllers = {
        ...model.controllers,
        [id]: {
          ...controller,
          pointer: { ...pointer, x: xs, y: ys, hoveredId }
        }
      }

      let nextModel: TVModel = {
        ...model,
        controllers: nextControllers
      }

      let effects: RawEffect<TVEnv, TVMsg>[] = []

      if (model.screen === 'driving' && model.driving) {
        const r = Driving.update(payload, model.driving, makeCtx(nextModel))
        nextModel = { ...nextModel, driving: r.model }
        effects = effects.concat(r.effects)
      }

      if (model.screen === 'pacman' && model.pacman) {
        const r = PacMan.update(payload, model.pacman, makeCtx(nextModel))
        nextModel = { ...nextModel, pacman: r.model }
        effects = effects.concat(r.effects)
      }

      if (model.screen === 'calibration' && model.calibration) {
        const r = Calibration.update(
          payload,
          model.calibration,
          makeCtx(nextModel)
        )
        nextModel = { ...nextModel, calibration: r.model }
        effects = effects.concat(r.effects)
      }

      return { model: nextModel, effects }
    }

    case MessageType.PLAYER_JOINED: {
      const players = [
        ...model.players,
        {
          id: payload.msg.id || '',
          name: payload.msg.name || 'Player',
          slot: payload.msg.slot ?? model.players.length
        }
      ]

      const screen: TVModel['screen'] =
        players.length === 1 ? 'menu' : model.screen

      return {
        model: { ...model, players, screen },
        effects: []
      }
    }

    case 'RESIZE':
      return {
        model: {
          ...model,
          screenW: payload.msg.width,
          screenH: payload.msg.height
        },
        effects: []
      }

    case MessageType.SPRAY_POINT:
    case WordPondMsg.NET_UPDATE:
    case WordPondMsg.SHAKE: {
      if (!model.wordpond) return { model, effects: [] }
      const r = WordPond.update(payload, model.wordpond, ctx)
      return { model: { ...model, wordpond: r.model }, effects: r.effects }
    }

    default: {
      if (payload.msg?.screen) {
        switch (payload.msg.screen) {
          case 'lobby':
            return Lobby.update(payload, model.lobby, ctx)
          case 'menu':
            return model.menu
              ? Menu.update(payload, model.menu, ctx)
              : { model, effects: [] }
          default:
            return { model, effects: [] }
        }
      }

      return { model, effects: [] }
    }
  }
}
