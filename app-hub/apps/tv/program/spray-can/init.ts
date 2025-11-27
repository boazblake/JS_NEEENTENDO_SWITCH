import { IO } from 'algebraic-js'
import type { SprayModel } from './types'
import { COLORS } from '@shared/types'

export const init = IO<{
  model: SprayModel
  effects: any[]
}>(() => ({
  model: {
    dots: [],
    colors: {}
  },
  effects: []
}))
