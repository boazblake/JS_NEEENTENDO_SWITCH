import type { Payload } from '@shared/types'

export const update = (payload: Payload | Msg, model: Model) => {
  // Handle network payload
  if (payload.type === 'TV_LIST') {
    return {
      model: { ...model, availableTvs: payload.msg.list },
      effects: []
    }
  }

  // Handle UI messages
  switch (payload.type) {
    case 'SET_TV_LIST':
      return {
        model: { ...model, availableTvs: payload.list },
        effects: []
      }

    case 'SELECT_TV':
      return {
        model: { ...model, selectedTv: payload.tvId },
        effects: []
      }

    default:
      return { model, effects: [] }
  }
}
