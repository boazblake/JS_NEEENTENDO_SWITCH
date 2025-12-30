import { IO } from 'algebraic-fx'
import type { Model } from './types'

export const init = IO.IO(() => ({
  model: { markers: {}, flipPY: false } as Model,
  effects: []
}))
