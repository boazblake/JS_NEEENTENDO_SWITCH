import { IO } from 'algebraic-js'
import type { Model } from './types.js'

export const init = IO(() => ({
  model: { screen: 'menu' } as Model,
  effects: []
}))
