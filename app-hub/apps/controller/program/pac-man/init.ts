import { IO } from 'algebraic-js'
import type { Model } from './types'

export const init = IO<{ model: Model; effects: any[] }>(() => ({
  model: { dir: null },
  effects: []
}))
