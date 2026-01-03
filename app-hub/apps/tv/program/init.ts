import { IO } from 'algebraic-fx'
import { Screen } from '@shared/types'
import { program as Controllers } from './controllers'
import type { TVModel, TVMsg } from './types'
import * as Network from './network'
export const init = IO.IO(() => {
  const session = Math.random().toString(36).substring(2, 7).toUpperCase()

  const model: TVModel = {
    session,
    screen: Screen.MENU,

    controllers: {},
    screenW: window.innerWidth,
    screenH: window.innerHeight,

    actions: [],
    players: [],

    menu: null,
    calibration: null,
    spray: null,
    wordpond: null,
    driving: null,
    pacman: null,

    network: Network.init()
  }

  const effects = [
    {
      type: 'NETWORK.ENABLE',
      msg: { url: 'wss://192.168.7.195:8081' }
    }
  ]

  return { model, effects }
})
