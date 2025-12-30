import { Screen, MessageType } from '@shared/types'

export type Model = {
  screen: Screen
}

export type Msg =
  | { type: MessageType.SELECT_APP; app: Screen.SPRAYCAN | Screen.WORDPOND }
  | { type: MessageType.BACK_TO_MENU }
