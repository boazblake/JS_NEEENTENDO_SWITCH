import { IO } from 'algebraic-js'
import { sendMsg } from '@/effects/network.js'
import type { Model } from './types.js'

/**
 * Controller init:
 * Prompts for the TV session code and returns the model plus
 * a Reader<NetEnv, IO> describing a REGISTER_PLAYER message.
 */
export const init = IO(() => {
  const session = prompt('Enter session code from TV')?.toUpperCase() ?? ''
  const id = crypto.randomUUID()
  const name = 'Guest'

  return {
    model: { id, name, session, status: 'idle' } as Model,
    effects: [sendMsg({ type: 'REGISTER_PLAYER', id, name, session })]
  }
})
