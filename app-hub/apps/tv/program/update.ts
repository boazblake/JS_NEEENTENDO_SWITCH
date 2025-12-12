import type { Dispatch } from 'algebraic-fx'
import { MessageType, WordPondMsg, type Payload } from '@shared/types'
import { sendMsg } from '@effects/network'
import { orientationToXY } from './effects'

import type { TVModel, TVContext, TVMsg } from './types'

import { program as Lobby } from './lobby'
import { program as Menu } from './menu'
import { program as Calibration } from './calibration'
import { program as Spray } from './spray-can'
import { program as WordPond } from './word-pond'
import { program as PacMan } from './pac-man'
import { program as Driving } from './driving'

const routeSubProgram = (
  payload: TVMsg,
  model: TVModel,
  dispatch: Dispatch<TVMsg>
) => {
  const ctx: TVContext = {
    session: model.session,
    screenW: model.screenW,
    screenH: model.screenH,
    controllers: model.controllers,
    actions: model.actions,
    players: model.players
  }

  const screen = payload.msg.screen as TVModel['screen']

  switch (screen) {
    case 'lobby': {
      const r = Lobby.update(payload, model.lobby, dispatch, ctx)
      return { model: { ...model, lobby: r.model }, effects: r.effects }
    }

    case 'menu': {
      if (!model.menu) return { model, effects: [] }
      const r = Menu.update(payload, model.menu, dispatch, ctx)
      return { model: { ...model, menu: r.model }, effects: r.effects }
    }

    case 'calibration': {
      if (!model.calibration) return { model, effects: [] }
      const r = Calibration.update(payload, model.calibration, dispatch, ctx)
      return { model: { ...model, calibration: r.model }, effects: r.effects }
    }

    case 'spraycan': {
      if (!model.spray) return { model, effects: [] }
      const r = Spray.update(payload, model.spray, dispatch, ctx)
      return { model: { ...model, spray: r.model }, effects: r.effects }
    }

    case 'wordpond': {
      if (!model.wordpond) return { model, effects: [] }
      const r = WordPond.update(payload, model.wordpond, dispatch, ctx)
      return { model: { ...model, wordpond: r.model }, effects: r.effects }
    }

    case 'driving': {
      if (!model.driving) return { model, effects: [] }
      const r = Driving.update(payload, model.driving, dispatch, ctx)
      return { model: { ...model, driving: r.model }, effects: r.effects }
    }

    case 'pacman': {
      if (!model.pacman) return { model, effects: [] }
      const r = PacMan.update(payload, model.pacman, dispatch, ctx)
      return { model: { ...model, pacman: r.model }, effects: r.effects }
    }

    default:
      return { model, effects: [] }
  }
}

export const update = (
  payload: TVMsg,
  model: TVModel,
  dispatch: Dispatch<TVMsg>
): { model: TVModel; effects: any[] } => {
  switch (payload.type) {
    case MessageType.RELAY_HELLO: {
      console.info('[tv] relay hello', payload)
      return { model, effects: [] }
    }

    case MessageType.NAVIGATE: {
      const screen = payload.msg.screen as TVModel['screen']
      const next = { ...model, screen }

      return {
        model: next,
        effects: [
          sendMsg({
            type: MessageType.SCREEN_SELECTED,
            msg: { session: model.session, screen }
          })
        ]
      }
    }

    case 'ACTIONS_REGISTERED': {
      return {
        model: { ...model, actions: payload.msg.actions || [] },
        effects: []
      }
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
        max: Math.PI / 3,
        invertX: true,
        invertY: true,
        dead: 0.03,
        sensX: 1.0,
        sensY: 1.0
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

      const effects: TVMsg[] = []

      if (hoveredId !== pointer.hoveredId) {
        effects.push(
          sendMsg({
            type: MessageType.POINTER_HOVER,
            msg: {
              session: model.session,
              id,
              hoveredId
            },
            t: Date.now()
          })
        )
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
      let nextEffects: any[] = effects

      if (model.screen === 'driving' && model.driving) {
        const ctx: TVContext = {
          session: nextModel.session,
          screenW: nextModel.screenW,
          screenH: nextModel.screenH,
          controllers: nextModel.controllers,
          actions: nextModel.actions,
          players: nextModel.players
        }

        const r = Driving.update(
          { type: MessageType.CALIB_UPDATE, msg: payload.msg } as TVMsg,
          model.driving,
          dispatch,
          ctx
        )

        nextModel = {
          ...nextModel,
          driving: r.model
        }
        nextEffects = [...nextEffects, ...r.effects]
      }

      if (model.screen === 'pacman' && model.pacman) {
        const ctx: TVContext = {
          session: nextModel.session,
          screenW: nextModel.screenW,
          screenH: nextModel.screenH,
          controllers: nextModel.controllers,
          actions: nextModel.actions,
          players: nextModel.players
        }

        const r = PacMan.update(payload, nextModel.pacman, dispatch, ctx)
        nextModel = {
          ...nextModel,
          pacman: r.model
        }
        nextEffects = [...nextEffects, ...r.effects]
      }

      if (model.screen === 'calibration' && model.calibration) {
        const ctx: TVContext = {
          session: nextModel.session,
          screenW: nextModel.screenW,
          screenH: nextModel.screenH,
          controllers: nextModel.controllers,
          actions: nextModel.actions,
          players: nextModel.players
        }

        const r = Calibration.update(
          payload,
          nextModel.calibration,
          dispatch,
          ctx
        )
        nextModel = {
          ...nextModel,
          calibration: r.model
        }
        nextEffects = [...nextEffects, ...r.effects]
      }

      return {
        model: nextModel,
        effects: nextEffects
      }
    }

    case MessageType.PLAYER_JOINED: {
      const players = [
        ...(model.players || []),
        {
          id: payload.msg.id || '',
          name: payload.msg.name || 'Player',
          slot: payload.msg.slot ?? model.players?.length ?? 0
        }
      ]
      const screen: TVModel['screen'] =
        players.length === 1 ? 'menu' : model.screen

      const effects =
        players.length === 1
          ? [
              sendMsg({
                type: MessageType.SCREEN_SELECTED,
                msg: { session: model.session, screen }
              })
            ]
          : []

      return {
        model: { ...model, players, screen },
        effects
      }
    }

    case 'RESIZE': {
      const { width, height } = payload.msg
      return {
        model: { ...model, screenW: width, screenH: height },
        effects: []
      }
    }

    case 'DRIVING_READY': {
      if (!model.driving) return { model, effects: [] }
      const ctx: TVContext = {
        session: model.session,
        screenW: model.screenW,
        screenH: model.screenH,
        controllers: model.controllers,
        actions: model.actions,
        players: model.players
      }
      const r = Driving.update(payload, model.driving, dispatch, ctx)
      return { model: { ...model, driving: r.model }, effects: r.effects }
    }

    case MessageType.SPRAY_POINT: {
      if (!model.spray) return { model, effects: [] }
      if (!payload.msg.active) return { model, effects: [] }

      const id = payload.msg.id
      const controller = model.controllers[id]
      if (!controller) return { model, effects: [] }

      const { x, y } = controller.pointer
      const color = model.spray.colors[id] ?? '#22c55e'
      const radius = 14
      const dotCount = 6

      const dots = Array.from({ length: dotCount }, () => {
        const angle = Math.random() * 2 * Math.PI
        const r = Math.sqrt(Math.random()) * radius
        return {
          x: x + Math.cos(angle) * r,
          y: y + Math.sin(angle) * r,
          color,
          size: 4 + Math.random() * 3,
          opacity: 0.6 + Math.random() * 0.25
        }
      })

      const tickPayload: TVMsg = {
        type: 'INTERNAL_SPRAY_TICK',
        msg: { screen: 'spraycan', dots },
        t: Date.now()
      }

      const ctx: TVContext = {
        session: model.session,
        screenW: model.screenW,
        screenH: model.screenH,
        controllers: model.controllers,
        actions: model.actions,
        players: model.players
      }

      const r = Spray.update(tickPayload, model.spray, dispatch, ctx)

      return {
        model: { ...model, spray: r.model },
        effects: r.effects
      }
    }

    case WordPondMsg.NET_UPDATE:
    case WordPondMsg.SHAKE: {
      if (!model.wordpond) return { model, effects: [] }
      const ctx: TVContext = {
        session: model.session,
        screenW: model.screenW,
        screenH: model.screenH,
        controllers: model.controllers,
        actions: model.actions,
        players: model.players
      }
      const r = WordPond.update(payload, model.wordpond, dispatch, ctx)
      return { model: { ...model, wordpond: r.model }, effects: r.effects }
    }

    default: {
      if (payload.msg?.screen) return routeSubProgram(payload, model, dispatch)
      return { model, effects: [] }
    }
  }
}
