import { IO } from 'algebraic-js'
import type { Model } from './types.js'

export const init = (): IO<{ model: Model; effects: any[] }> =>
  IO(() => ({
    model: {
      host: 'CONTROLLER',
      id: undefined,
      slot: undefined,
      name: 'Guest',
      state: {}
    },
    effects: []
  }))
