import { IO } from 'algebraic-js'
import type { Model } from './types.js'

export const init = IO(() => ({
  model: { x: 0.5, y: 0.5, alpha: 0 } as Model,
  effects: []
}))
