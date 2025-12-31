import type { Model, Msg } from './types'

export const update = (msg: Msg, model: Model) => {
  console.log('lobby')
  switch (msg.type) {
    case 'SET_TV_LIST':
      return {
        model: { ...model, availableTvs: msg.list },
        effects: []
      }

    case 'SELECT_TV':
      return {
        model: { ...model, selectedTv: msg.tvId },
        effects: []
      }

    default:
      return { model, effects: [] }
  }
}
