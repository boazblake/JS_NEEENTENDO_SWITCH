import { IO } from 'algebraic-js'
import type { Model } from './types'

export const init = IO(() => ({
  model: { color: 'teal', spraying: false } as Model,
  effects: []
}))
