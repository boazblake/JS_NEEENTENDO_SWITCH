import { IO } from 'algebraic-fx'
import type { Model } from './types.js'
import { Screen } from '@shared/types'

export const init = IO(() => ({
  model: { screen: Screen.LOBBY } as Model,
  effects: []
}))
