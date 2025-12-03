import { IO } from 'algebraic-fx'
import { sendMsg, broadcastState } from '@effects/network'
import { MessageType } from '@shared/types'
import type { TVModel } from './types'
import { env } from '../main.ts'
import { init as lobbyInit } from './lobby/init'
import { init as menuInit } from './menu/init'
import { init as calibrationInit } from './calibration/init'
import { init as sprayInit } from './spray-can/init'
import { init as wordPondInit } from './word-pond/init'
import { init as drivingInit } from './driving/init'
import { init as pacmanInit } from './pac-man/init'

export const init = IO<{ model: TVModel; effects: any[] }>(() => {
  const session = Math.random().toString(36).substring(2, 7).toUpperCase()

  const lobby = lobbyInit.run().model
  const menu = menuInit.run().model
  const calibration = calibrationInit.run().model
  const spray = sprayInit.run().model
  const wordpond = wordPondInit.run().model
  const driving = drivingInit.run().model
  const pacman = pacmanInit.run().model

  const model: TVModel = {
    session,
    screen: 'lobby',

    controllers: {},
    screenW: window.innerWidth,
    screenH: window.innerHeight,

    actions: [],
    players: [],

    lobby,
    menu,
    calibration,
    spray,
    driving,
    wordpond,
    pacman
  }

  return {
    model,
    effects: [
      sendMsg({
        type: MessageType.REGISTER_TV,
        msg: { session }
      })
      // broadcastState(env.ws, () => model)
    ]
  }
})
