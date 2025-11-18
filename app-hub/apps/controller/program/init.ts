import { IO } from 'algebraic-js'
import { sendMsg } from '@/effects/network.js'
import type { Model } from './types.js'

import { init as lobbyInit } from './lobby/init.js'
import { init as menuInit } from './menu/init.js'
import { init as calibrationInit } from './calibration/init.js'
import { init as sprayInit } from './spray-can/init.js'
import { env } from '../main.ts'
export const init = IO(() => {
  const { id, session } = env
  const name = 'Guest'

  const lobby = lobbyInit.run().model
  const menu = menuInit.run().model
  const calibration = calibrationInit.run().model
  const spray = sprayInit.run().model

  const model: Model = {
    id,
    name,
    session,
    status: 'idle',
    screen: 'lobby',
    lobby,
    menu,
    calibration,
    spray
  }

  const effects = [
    sendMsg({
      type: 'REGISTER_PLAYER',
      id,
      name,
      session
    })
  ]

  return { model, effects }
})
