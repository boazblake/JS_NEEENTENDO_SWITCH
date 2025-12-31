import {
  MessageType,
  Screen,
  ScreenIn,
  ScreenOut,
  type Payload
} from './types.js'

export const createMsg = (
  type: MessageType | string,
  msg: { screen?: Screen; [k: string]: any },
  t = Date.now()
): Payload => {
  console.log(type, msg)
  return { type, msg, t }
}

export const withIds = (
  p: Payload,
  id?: string,
  session?: string
): Payload => ({
  ...p,
  msg: { ...p.msg, id, session }
})
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
