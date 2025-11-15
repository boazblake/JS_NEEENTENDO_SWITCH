import { IO } from 'algebraic-js'
import { sendMsg } from '@/effects/network.js'
import type { Model } from './types.js'

/**
 * TV init:
 * Generates a session code, returns the initial model and
 * a Reader<NetEnv, IO> describing a REGISTER_TV message.
 */
export const init = IO(() => {
  const session = Math.random().toString(36).substring(2, 7).toUpperCase()

  return {
    model: {
      session,
      players: {},
      status: 'idle'
    } as Model,
    effects: [sendMsg({ type: 'REGISTER_TV', session })]
  }
})
