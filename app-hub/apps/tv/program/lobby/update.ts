import type { Model, Msg } from './types.js'
import { Screen } from '@/shared/types.js'

export const update = (msg: Msg, model: Model) => {
  switch (msg.type) {
    case 'SELECT_APP':
      return { model: { ...model, screen: msg.app }, effects: [] }

    case 'BACK_TO_MENU':
      return { model: { ...model, screen: Screen.MENU }, effects: [] }

    default:
      return { model, effects: [] }
  }
}
