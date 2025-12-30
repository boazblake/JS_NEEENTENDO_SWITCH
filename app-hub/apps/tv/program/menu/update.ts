import type { Model, Msg } from './types'
import { Screen, MessageType } from '@shared/types'

export const update = (msg: Msg, model: Model) => {
  switch (msg.type) {
    case MessageType.SELECT_APP:
      return {
        model: { ...model, screen: msg.app },
        effects: []
      }

    case MessageType.BACK_TO_MENU:
      return {
        model: { ...model, screen: Screen.MENU },
        effects: []
      }

    default:
      return { model, effects: [] }
  }
}
