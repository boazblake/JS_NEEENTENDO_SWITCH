import { IO } from 'algebraic-fx'
import * as Network from './network'
import type { Model } from './types'

export const init = IO.IO(() => ({
  model: {
    screen: 'menu',
    tvList: [],
    session: null,
    network: Network.init()
  } satisfies Model,
  effects: [
    IO(() => ({
      type: 'Network',
      msg: { type: 'Enable', url: 'wss://localhost:8081/' }
    }))
  ]
}))
