import { Screen } from '@shared/types'

export type Model = {
  screen: Screen.MENU | Screen.CALIBRATION | Screen.SPRAYCAN | Screen.LOBBY
  pointer: { x: number; y: number }
  hovered?: number
}

export type Msg =
  | { type: MessageType.SELECT_APP; app: Screen.SPRAYCAN | Screen.WORDPOND }
  | { type: MessageType.BACK_TO_MENU }
