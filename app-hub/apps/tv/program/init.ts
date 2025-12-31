import { IO } from 'algebraic-fx'
import { Screen, MessageType } from '@shared/types'
import { send } from '@shared/network/send'
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
    IO.IO(() => ({
      type: 'Network',
      msg: { type: 'Enable', url: 'wss://192.168.7.195:8081' }
    })),
    send({
      type: MessageType.REGISTER_TV,
      msg: { session },
      t: Date.now()
    })
  ]

  return { model, effects }
})
