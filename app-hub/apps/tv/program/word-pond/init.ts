import { IO } from 'algebraic-js'
import type { Model } from './types.js'

export const init = (): IO<{ model: Model; effects: any[] }> =>
  IO(() => ({
    model: { host: 'TV', players: {}, count: 0 },
    effects: []
  }))
