import { IO } from 'algebraic-js'
import type { Model } from './types'

export const init = IO<{ model: Model; effects: any[] }>(() => ({
  model: {
    car: {
      x: 0,
      z: 0,
      vel: 0,
      steer: 0
    }
  },
  effects: []
}))
