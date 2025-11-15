import type { Model, Msg } from './types.js'

export const update = (msg: Msg, model: Model, dispatch) => {
  switch (msg.type) {
    case 'SELECT_APP':
      return { model: { ...model, screen: msg.app }, effects: [] }
    case 'BACK_TO_MENU':
      return { model: { ...model, screen: 'menu' }, effects: [] }
    default:
      return { model, effects: [] }
  }
}
