import type { Model, Msg, ControllerState } from './types'

export const update = (
  payload: Msg,
  model: Model
): { model: Model; effects: any[] } => {
  console.log('CONTROLL', payload)
  switch (payload.type) {
    case 'SENSOR.MOTION': {
      const { id, quaternion, gravity, rotation } = payload.msg as any

      const controller: ControllerState = model.controllers[id] ?? {
        pointer: { x: 0, y: 0, hoveredId: null },
        player: null,
        spraying: false
      }

      return {
        model: {
          controllers: {
            ...model.controllers,
            [id]: controller
          }
        },
        effects: []
      }
    }

    case 'SESSION.PLAYER_JOINED': {
      const { id, name, slot } = payload.msg as any
      const controller = model.controllers[id] ?? {
        pointer: { x: 0, y: 0, hoveredId: null },
        player: null,
        spraying: false
      }

      return {
        model: {
          controllers: {
            ...model.controllers,
            [id]: {
              ...controller,
              player: { id, name, slot }
            }
          }
        },
        effects: []
      }
    }

    case 'SESSION.PLAYER_LEFT': {
      const { id } = payload.msg as any
      const { [id]: _, ...rest } = model.controllers
      return { model: { controllers: rest }, effects: [] }
    }

    default:
      return { model, effects: [] }
  }
}
