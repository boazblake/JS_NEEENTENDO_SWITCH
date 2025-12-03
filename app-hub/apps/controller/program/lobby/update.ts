import type { Model } from './types.js'
import type { Dispatch } from 'algebraic-fx'
import type { Payload } from '@shared/types'
import { MessageType } from '@shared/types'

export const update = (msg: Payload, model: Model, dispatch: Dispatch) => {
  switch (msg.type) {
    case MessageType.TV_LIST: {
      const next = { ...model, availableTvs: msg.msg.list ?? [] }
      return { model: next, effects: [] }
    }

    case 'SELECT_TV': {
      const tvId = msg.msg.tvId
      const next = { ...model, connectedTv: tvId }
      // Pass upward so parent can register and set session
      dispatch(msg)
      return { model: next, effects: [] }
    }

    default:
      return { model, effects: [] }
  }
}
