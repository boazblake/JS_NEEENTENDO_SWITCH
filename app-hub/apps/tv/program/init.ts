import { IO } from 'algebraic-fx'
import { Screen, MessageType } from '@shared/types'
import type { TVModel, TVMsg } from './types'
import * as Network from './network'

// import { init as lobbyInit } from './lobby/init'

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

    // lobby: lobbyInit(),
    menu: null,
    calibration: null,
    spray: null,
    wordpond: null,
    driving: null,
    pacman: null,

    network: Network.init()
  }

  const effects = [
    IO.IO<TVMsg>(() => ({
      type: 'Network',
      msg: { type: 'Enable', url: 'wss://localhost:8081/' }
    })),
    IO.IO<TVMsg>(() => ({
      type: 'Network',
      msg: {
        type: 'Send',
        msg: {
          type: MessageType.REGISTER_TV,
          msg: { session },
          t: Date.now()
        } satisfies Payload
      }
    }))
  ]

  return { model, effects }
})
