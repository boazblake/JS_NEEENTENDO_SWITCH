// controller/init.ts
import { IO } from 'algebraic-js'
import type { ControllerModel } from './types'

import { init as lobbyInit } from './lobby/init'
import { init as menuInit } from './menu/init'
import { init as calibrationInit } from './calibration/init'
import { init as sprayInit } from './spray-can/init'
import { init as wordPondInit } from './word-pond/init'

import { env } from '../main'

export const init = IO<{ model: ControllerModel; effects: any[] }>(() => {
  const { id, session } = env
  const name = 'Guest'

  const lobby = lobbyInit.run().model
  const menu = menuInit.run().model
  const calibration = calibrationInit.run().model
  const spray = sprayInit.run().model
  const wordpond = wordPondInit.run().model

  const model: ControllerModel = {
    id,
    name,
    session,
    status: 'idle',
    screen: 'lobby',
    hoveredId: null,
    lobby,
    menu,
    calibration,
    spray,
    wordpond
  }

  return { model, effects: [] }
})
