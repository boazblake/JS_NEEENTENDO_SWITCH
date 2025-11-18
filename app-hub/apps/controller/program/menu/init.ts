import { IO } from 'algebraic-js'
import type { Model } from './types.js'
export const init = IO(() => ({
  model: { ready: false } as Model,
  effects: []
}))
