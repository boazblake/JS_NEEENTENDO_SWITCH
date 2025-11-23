import type { Model, Msg } from './types.js'
import type { Dispatch } from 'algrebaic-js'
import { sendMsg } from '@effects/network'
import { MessageType, Screen } from '@shared/types'
import { wrapScreenOut } from '@shared/utils'

export const update = (msg: Msg, model: Model, dispatch: Disaptch) => {
  switch (msg.type) {
    case MessageType.CONNECT_TO_TV:
      return {
        model,
        effects: [sendMsg(MessageType.SCREEN_OUT, msg)]
      }

    case MessageType.TV_LIST: {
      return { model: { ...model, availableTvs: msg.msg.list }, effects: [] }
    }
    default:
      return { model, effects: [] }
  }
}
