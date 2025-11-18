import { IO } from 'algebraic-js'
import type { Model } from './types.js'

export const init = IO(() => ({
  model: { session: '', connected: false } as Model,
  effects: []
}))
