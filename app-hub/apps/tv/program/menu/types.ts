import { Screen } from '@shared/types'

export type Model = {
  /** Which screen the menu is currently pointing to */
  screen: Screen.MENU | Screen.CALIBRATION | Screen.SPRAYCAN | Screen.LOBBY
}

export type Msg =
  | { type: MessageType.SELECT_APP; app: Screen.SPRAYCAN | Screen.WORDPOND }
  | { type: MessageType.BACK_TO_MENU }
