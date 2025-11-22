import { sendMsg } from '@effects/network'
import type { Model, Msg } from './types.js'

export const update = (
  msg: Msg,
  model: Model,
  _dispatch: any,
  session?: string,
  id?: string
) => {
  switch (msg.type) {
    case 'COLOR_CHANGED':
      return { model: { ...model, color: msg.color }, effects: [] }

    case 'TRIGGER_START':
      return {
        model: { ...model, spraying: true },
        effects: [
          sendMsg({ type: 'SPRAY_START', id, color: model.color, session })
        ]
      }

    case 'TRIGGER_MOVE':
      if (!model.spraying) return { model, effects: [] }
      return {
        model,
        effects: [
          sendMsg({
            type: 'SPRAY_POINT',
            id,
            x: msg.x,
            y: msg.y,
            pressure: msg.pressure ?? 1,
            session
          })
        ]
      }

    case 'TRIGGER_END':
      return {
        model: { ...model, spraying: false },
        effects: [sendMsg({ type: 'SPRAY_END', id, session })]
      }

    default:
      return { model, effects: [] }
  }
}
