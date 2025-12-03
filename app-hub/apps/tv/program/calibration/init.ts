import { IO } from 'algebraic-fx'
import type { Model } from './types.js'

export const init = IO(() => ({
  model: { markers: {}, flipPY: false } as Model,
  effects: []
}))
