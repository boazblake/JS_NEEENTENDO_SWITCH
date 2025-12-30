import { IO } from 'algebraic-fx'
import type { Model } from './types'

export const init = IO.IO<{ model: Model; effects: any[] }>(() => ({
  model: { color: 'teal' },
  effects: []
}))
