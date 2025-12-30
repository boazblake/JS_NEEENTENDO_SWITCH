import { IO } from 'algebraic-fx'
import type { Model } from './types'

export const init = IO.IO<{ model: Model; effects: any[] }>(() => ({
  model: { steer: 0, throttle: 0, brake: 0 },
  effects: []
}))
