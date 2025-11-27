import { MessageType } from '@shared/types'
import type { Dispatch } from 'algebraic-js'

export const update = (payload, model, _dispatch: Dispatch) => {
  switch (payload.type) {
    case MessageType.SPRAY_START:
      return { model: { ...model, color: payload.msg.color }, effects: [] }

    case MessageType.SPRAY_POINT:
      return { model: { ...model, spraying: true }, effects: [] }

    case MessageType.SPRAY_END:
      return { model: { ...model, spraying: false }, effects: [] }

    case 'APP_SELECTED':
      return { model: { ...model, screen: payload.msg.app }, effects: [] }

    default:
      return { model, effects: [] }
  }
}
