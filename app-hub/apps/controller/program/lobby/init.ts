import { IO } from 'algebraic-fx'
import type { Model } from './types'

export const init = IO.IO(() => ({
  model: {
    availableTvs: [],
    selectedTv: null
  } satisfies Model,
  effects: []
}))
