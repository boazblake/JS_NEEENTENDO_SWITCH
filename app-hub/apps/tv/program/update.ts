import type { Dispatch } from 'algebraic-js'
import type { Model } from './types'
import { MessageType, Screen, type Payload } from '@shared/types'
import { program as Lobby } from './lobby/index'
import { program as Menu } from './menu/index'
import { program as Calibration } from './calibration/index'
import { program as Spray } from './spray-can/index'
import { orientationToXY } from './effects.ts'
import { sendMsg } from '@effects/network'
import { drawSprayIO } from './spray-can/draw' // if you use the canvas draw IO

const routeSubProgram = (
  payload: Payload,
  model: Model,
  dispatch: Dispatch
) => {
  switch (payload.msg.screen) {
    case Screen.LOBBY: {
      const r = Lobby.update(payload, model.gameState, dispatch)
      return { model: { ...model, gameState: r.model }, effects: r.effects }
    }
    case Screen.MENU: {
      const r = Menu.update(payload, model.gameState, dispatch)
      return { model: { ...model, gameState: r.model }, effects: r.effects }
    }
    case Screen.CALIBRATION: {
      const r = Calibration.update(payload, model.gameState, dispatch)
      return { model: { ...model, gameState: r.model }, effects: r.effects }
    }
    case Screen.SPRAYCAN: {
      const r = Spray.update(payload, model.gameState, dispatch)
      return { model: { ...model, gameState: r.model }, effects: r.effects }
    }
    default:
      return { model, effects: [] }
  }
}

export const update = (payload: Payload, model: Model, dispatch: Dispatch) => {
  switch (payload.type) {
    case 'INTERNAL_SPRAY_TICK':
    case MessageType.SPRAY_START: {
      const r = Spray.update(payload, model.spray)
      return {
        model: { ...model, spray: r.model },
        effects: r.effects
      }
    }
    // -----------------------------------------------------------------------
    // SPRAY: POINT → synthesize INTERNAL_SPRAY_TICK using controller pointer
    // -----------------------------------------------------------------------
    case MessageType.SPRAY_POINT: {
      if (!payload.msg.active) return { model, effects: [] }

      const id = payload.msg.id
      const controller = model.controllers[id]
      if (!controller) return { model, effects: [] }

      const { x, y } = controller.pointer

      const color = model.spray?.colors[id] ?? '#22c55e' // <-- from mapping

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

      const tickPayload = {
        type: 'INTERNAL_SPRAY_TICK',
        msg: { dots }
      }

      const r = Spray.update(tickPayload, model.spray)

      return {
        model: { ...model, spray: r.model },
        effects: r.effects
      }
    }

    // You can keep SPRAY_END as a no-op for now
    // case MessageType.SPRAY_END:
    //   return { model, effects: [] }
    // -----------------------------------------------------------------------
    //  Window resize events
    // -----------------------------------------------------------------------
    case 'RESIZE': {
      const { width, height } = payload.msg
      return {
        model: { ...model, screenW: width, screenH: height },
        effects: []
      }
    }

    // -----------------------------------------------------------------------
    //  Registered DOM actions
    // -----------------------------------------------------------------------
    case 'ACTIONS_REGISTERED': {
      return {
        model: {
          ...model,
          actions: payload.msg.actions || []
        },
        effects: []
      }
    }

    // -----------------------------------------------------------------------
    //  Continuous motion updates (controller tilt)
    // -----------------------------------------------------------------------
    case MessageType.CALIB_UPDATE: {
      const { id, q, g } = payload.msg

      // ensure controller entry exists
      const controller = model.controllers[id] ?? {
        pointer: { x: 0, y: 0, hoveredId: null },
        player: null
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

      // ---------------------------------------------------------------------------
      // Hover detection using global model.actions
      // ---------------------------------------------------------------------------
      let hoveredId = null

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

      const effects: any[] = []

      // Broadcast hover event if changed
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

      return {
        model: {
          ...model,
          controllers: {
            ...model.controllers,
            [id]: {
              ...controller,
              pointer: {
                ...pointer,
                x: xs,
                y: ys,
                hoveredId
              }
            }
          }
        },
        effects
      }
    }

    // -----------------------------------------------------------------------
    //  Controller successfully joined
    // -----------------------------------------------------------------------
    case MessageType.PLAYER_JOINED: {
      const players = [
        ...(model.players || []),
        {
          id: payload.msg.id || '',
          name: payload.msg.name || 'Player'
        }
      ]
      const screen = players.length == 1 ? Screen.MENU : model.screen
      const effects =
        players.length > 1
          ? [
              sendMsg({
                type: MessageType.APP_SELECTED,
                msg: { session: model.session, app: screen }
              })
            ]
          : []
      const next = {
        ...model,
        screen,
        players
      }
      return { model: next, effects }
    }

    // -----------------------------------------------------------------------
    //  App selection from TV → Controller sync
    // -----------------------------------------------------------------------
    case MessageType.NAVIGATE: {
      const next = { ...model, screen: payload.msg.to }
      return {
        model: next,
        effects: [
          sendMsg({
            type: MessageType.APP_SELECTED,
            msg: { session: model.session, app: payload.msg.to }
          })
        ]
      }
    }

    default:
      return { model, effects: [] }
  }
}
