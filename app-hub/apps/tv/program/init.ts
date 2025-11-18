import { IO } from 'algebraic-js'
import { sendMsg } from '@/effects/network.js'
import { MessageType } from '@/shared/types.js'
import { init as lobbyInit } from './lobby/init.js'
import { init as menuInit } from './menu/init.js'
import { init as calibrationInit } from './calibration/init.js'
import { init as sprayInit } from './spray-can/init.js'
import type { Model } from './types.js'

export const init = IO(() => {
  const session = Math.random().toString(36).substring(2, 7).toUpperCase()

  const lobby = lobbyInit.run().model
  const menu = menuInit.run().model
  const calibration = calibrationInit.run().model
  const spray = sprayInit.run().model

  const model: Model = {
    session,
    players: {},
    status: 'idle',
    screen: 'lobby',
    lobby,
    menu,
    calibration,
    spray
  }

  return {
    model,
    effects: [sendMsg({ type: MessageType.REGISTER_TV, session })]
  }
})
