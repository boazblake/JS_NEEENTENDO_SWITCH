import { IO } from 'algebraic-js'
import type { Model } from './types'

export const init = IO<{ model: Model; effects: any[] }>(() => ({
  model: {
    car: {
      x: window.innerWidth * 0.5,
      y: window.innerHeight * 0.8,
      vel: 0,
      angle: 0
    }
  },
  effects: []
}))
