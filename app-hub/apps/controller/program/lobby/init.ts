import { IO } from 'algebraic-fx'
import type { Model } from './types.js'

export const init = IO(() => ({
  model: {
    availableTvs: [],
    connectedTv: ''
  } as Model,
  effects: []
}))
