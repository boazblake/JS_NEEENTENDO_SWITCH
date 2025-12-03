import { IO } from 'algebraic-fx'
import type { Model } from './types'

export const init = IO<{ model: Model; effects: any[] }>(() => ({
  model: { dots: [], colors: {} },
  effects: []
}))
