import { IO } from 'algebraic-js'
import { sendMsg } from '@effects/network'
import { MessageType, Screen } from '@shared/types'
import { init as lobbyInit } from './lobby/init'
import { init as menuInit } from './menu/init'
import { init as calibrationInit } from './calibration/init'
import { init as sprayInit } from './spray-can/init'
import type { Model } from './types'

export const init = IO<{
  model: Model
  effects: any[]
}>(() => {
  const session = Math.random().toString(36).substring(2, 7).toUpperCase()

  const lobby = lobbyInit.run().model
  const menu = menuInit.run().model
  const calibration = calibrationInit.run().model
  const spray = sprayInit.run().model

  const model: Model = {
    session,
    screen: Screen.LOBBY,
    controllers: {},
    screenW: window.innerWidth,
    screenH: window.innerHeight,
    spray,
    sprayDrawLoopStarted: false,
    lobby,
    menu,
    calibration
  }

  return {
    model,
    effects: [
      sendMsg({
        type: MessageType.REGISTER_TV,
        msg: { session }
      })
    ]
  }
})
