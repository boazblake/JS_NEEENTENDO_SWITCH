import type { Dispatch } from 'algebraic-js'
import type { Model } from './types'
import { MessageType, Screen, type Payload } from '@shared/types'
import { program as Lobby } from './lobby/index'
import { program as Menu } from './menu/index'
import { program as Calibration } from './calibration/index'
import { program as Spray } from './spray-can/index'
import { orientationToXY } from './effects.ts'
import { sendMsg } from '@effects/network'
import { drawSprayIO } from './spray-can/view' // if you use the canvas draw IO

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
          pointer: { ...model.pointer, actions: payload.msg.actions || [] }
        },
        effects: []
      }
    }

    // -----------------------------------------------------------------------
    //  Continuous motion updates (controller tilt)
    // -----------------------------------------------------------------------
    case MessageType.CALIB_UPDATE: {
      const { q, g } = payload.msg
      const [x, y] = orientationToXY(q, g, model.screenW, model.screenH, {
        max: Math.PI / 3,
        invertX: true,
        invertY: true,
        dead: 0.03,
        sensX: 1.0,
        sensY: 1.0
      })

      const smooth = (a: number, b: number, f = 0.15) => a + (b - a) * f
      const xs = smooth(model.pointer?.x ?? x, x)
      const ys = smooth(model.pointer?.y ?? y, y)

      // -------------------------------------------------------------------------
      //  Hover detection
      // -------------------------------------------------------------------------
      let hoveredId = model.pointer?.hoveredId ?? null
      const actions = model.pointer?.actions ?? []
      if (actions.length) {
        const hit = actions.find(
          (a) =>
            xs >= a.rect.x &&
            xs <= a.rect.x + a.rect.w &&
            ys >= a.rect.y &&
            ys <= a.rect.y + a.rect.h
        )
        hoveredId = hit ? hit.id : null
      }

      const effects: any[] = []

      // When hover target changes, notify controller and maybe trigger local highlight
      if (hoveredId !== model.pointer?.hoveredId) {
        effects.push(
          sendMsg({
            type: MessageType.POINTER_HOVER,
            msg: { session: model.session, id: hoveredId },
            t: Date.now()
          })
        )
      }

      return {
        model: {
          ...model,
          pointer: { ...model.pointer, x: xs, y: ys, hoveredId }
        },
        effects
      }
    }

    // -----------------------------------------------------------------------
    //  Controller successfully joined
    // -----------------------------------------------------------------------
    case MessageType.PLAYER_JOINED: {
      const next = {
        ...model,
        screen: Screen.MENU,
        players: [
          ...(model.players || []),
          {
            id: payload.msg.id || '',
            name: payload.msg.name || 'Player'
          }
        ]
      }
      return { model: next, effects: [] }
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
    case 'INTERNAL_SPRAY_TICK': {
      const nextSpray = Spray.update(payload, model, dispatch)
      return {
        model: { ...model, spray: nextSpray },
        effects: [drawSprayIO({ ...model, spray: nextSpray })]
      }
    }
    case MessageType.SPRAY_START:
    case MessageType.SPRAY_POINT:
    case MessageType.SPRAY_END: {
      // If this message is for the spray-can screen, forward to that sub-program
      if (payload.msg.screen === Screen.SPRAYCAN) {
        const nextSpray = Spray.update(payload, model, dispatch)
        return { model: { ...model, spray: nextSpray }, effects: [] }
      }

      // Otherwise ignore or handle globally
      return { model, effects: [] }
    }
    default:
      return { model, effects: [] }
  }
}
