import { MessageType, Screen, ScreenIn, ScreenOut } from './types.js'

export const wrapScreenIn = (screen: Screen, payload: any): ScreenIn => ({
  type: MessageType.SCREEN_IN,
  screen,
  payload
})

export const wrapScreenOut = (screen: Screen, payload: any): ScreenOut => ({
  type: MessageType.SCREEN_OUT,
  screen,
  payload
})
