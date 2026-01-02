import type { Payload } from '@shared/types'
import { MessageDomain } from '@shared/types'

export const update = (payload: Payload | Msg, model: Model) => {
  // Handle network payloads
  if (payload.type === 'LOBBY.TV_LIST') {
    return {
      model: { ...model, availableTvs: payload.msg.list },
      effects: []
    }
  }

  // Handle local UI messages
  switch (payload.type) {
    case MessageType.SELECT_APP:
      return {
        model: { ...model, screen: payload.app },
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
