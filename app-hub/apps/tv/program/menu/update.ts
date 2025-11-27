import { Screen, MessageType } from '@shared/types'
import type { Model } from '../types'

export const update = (msg: any, model: Model) => {
  switch (msg.type) {
    case 'NAVIGATE':
      return {
        model: { ...model, screen: msg.msg.to },
        effects: []
      }

    case MessageType.UPDATE_ACTIONS: {
      const { actions } = msg.msg

      const controllers = { ...model.controllers }

      for (const id in controllers) {
        const c = controllers[id]
        controllers[id] = {
          ...c,
          pointer: {
            ...c.pointer,
            actions
          }
        }
      }

      return {
        model: {
          ...model,
          controllers
        },
        effects: []
      }
    }

    default:
      return { model, effects: [] }
  }
}
