// tv/program/init.ts
import { IO } from 'algebraic-fx'
import type { RawEffect } from 'algebraic-fx'
import type { TVModel, TVMsg } from './types'
import type { TVEnv } from '../env'

import { Screen } from '@shared/types'

import { resizeEffect, actionsEffect } from '@effects/global'
import { socketEffect } from '@effects/socket'

import { init as lobbyInit } from './lobby/init'
import { init as menuInit } from './menu/init'

export const init = IO<{
  model: TVModel
  effects: RawEffect<TVEnv>[]
}>(() => {
  const session = Math.random().toString(36).substring(2, 7).toUpperCase()

  const lobby = lobbyInit.run().model
  const menu = menuInit.run().model

  const model: TVModel = {
    session,
    screen: Screen.LOBBY,

    controllers: {},
    screenW: window.innerWidth,
    screenH: window.innerHeight,

    actions: [],
    players: [],

    lobby,
    menu,
    calibration: null,
    spray: null,
    wordpond: null
  }

  return {
    model,
    effects: [socketEffect, resizeEffect, actionsEffect]
  }
})
