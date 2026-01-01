// controller/init.ts
import { IO } from 'algebraic-fx'
import type { ControllerModel } from './types'

import { send } from './network'
import { init as lobbyInit } from './lobby/init'
import { init as menuInit } from './menu/init'
import { init as calibrationInit } from './calibration/init'
import { init as sprayInit } from './spray-can/init'
import { init as wordPondInit } from './word-pond/init'
import { init as drivingInit } from './driving/init'
import { init as pacmanInit } from './pac-man/init'
import * as Network from './network/'

export const init = IO.IO<{ model: ControllerModel; effects: any[] }>(() => {
  const name = 'Guest'

  const lobby = lobbyInit.run().model
  const menu = menuInit.run().model
  const calibration = calibrationInit.run().model
  const spray = sprayInit.run().model
  const wordpond = wordPondInit.run().model
  const driving = drivingInit.run().model
  const pacman = pacmanInit.run().model
  const network = Network.init()

  const model: ControllerModel = {
    name,
    status: 'idle',
    screen: 'lobby',
    hoveredId: null,
    lobby,
    driving,
    menu,
    calibration,
    spray,
    pacman,
    wordpond,
    network
  }

  return {
    model,
    effects: [
      IO.IO(() => ({
        type: 'Enable',
        url: 'wss://192.168.7.195:8081'
      }))
    ]
  }
})
