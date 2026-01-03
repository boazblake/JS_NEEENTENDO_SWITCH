import { orientationToXY } from '../effects' // or wherever it lives
import type { Model, Msg, ControllerState } from './types'
import type { Dispatch } from 'algebraic-fx'

export const update = (
  payload: Msg,
  model: Model,
  dispatch: Dispatch,
  ctx: {
    screenW: number
    screenH: number
  }
): { model: Model; effects: any[] } => {
  switch (payload.type) {
    case 'SENSOR.MOTION': {
      const { id, quaternion, gravity } = payload.msg as any

      const controller: ControllerState = model[id] ?? {
        pointer: { x: ctx.screenW / 2, y: ctx.screenH / 2, hoveredId: null },
        player: id,
        spraying: false
      }

      const [x, y] = orientationToXY(
        quaternion,
        gravity,
        ctx.screenW,
        ctx.screenH,
        {
          invertX: true,
          invertY: true,
          dead: 0.03
        }
      )

      return {
        model: {
          ...model,
          [id]: {
            ...controller,
            pointer: {
              ...controller.pointer,
              x,
              y
            }
          }
        },
        effects: []
      }
    }

    case 'SESSION.PLAYER_JOINED': {
      const { id, name, slot } = payload.msg as any

      const controller: ControllerState = model[id] ?? {
        pointer: { x: 0, y: 0, hoveredId: null },
        player: null,
        spraying: false
      }

      return {
        model: {
          ...model,
          [id]: {
            ...controller,
            player: { id, name, slot }
          }
        },
        effects: []
      }
    }

    case 'SESSION.PLAYER_LEFT': {
      const { id } = payload.msg as any
      const { [id]: _, ...rest } = model
      return { model: rest, effects: [] }
    }

    default:
      return { model, effects: [] }
  }
}
