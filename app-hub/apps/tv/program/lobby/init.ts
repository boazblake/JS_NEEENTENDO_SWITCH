import { IO } from 'algebraic-js'
import type { Model } from './types.js'
import { Screen } from '@/shared/types.js'

export const init = IO(() => ({
  model: { screen: Screen.LOBBY } as Model,
  effects: []
}))
