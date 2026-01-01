import type { Payload } from './types'
import { MessageDomain, MessageType, Screen } from './types'

export const createMsg = <TMsg extends Record<string, unknown>>(
  type: MessageType | string,
  msg: TMsg,
  t = Date.now()
): Payload<string, TMsg> => ({ type, msg, t })

export const withIds = <TMsg extends Record<string, unknown>>(
  p: Payload<string, TMsg>,
  id?: string,
  session?: string
): Payload<string, TMsg & { id?: string; session?: string }> => ({
  ...p,
  msg: { ...(p.msg as any), id, session }
})

/* ------------------------------------------------------------------
 * Compatibility shims (TEMPORARY)
 * ------------------------------------------------------------------ */

export const wrapScreenIn = (screen: Screen, payload: any): Payload => ({
  type: MessageType.NAVIGATE,
  msg: { screen, ...payload },
  t: Date.now()
})

export const wrapScreenOut = (screen: Screen, payload: any): Payload => ({
  type: MessageType.NAVIGATE,
  msg: { screen, ...payload },
  t: Date.now()
})

export const splitRoute = (
  type: string
): {
  domain: MessageDomain
  rest: string
} => {
  const idx = type.indexOf('.')
  if (idx === -1) {
    return { domain: type as MessageDomain, rest: '' }
  }

  return {
    domain: type.slice(0, idx) as MessageDomain,
    rest: type.slice(idx + 1)
  }
}
