import { IO } from 'algebraic-js'
import type { Model } from './types.js'
import { Screen } from '@shared/types'

export const init = IO(() => ({
  model: { screen: Screen.MENU } as Model,
  effects: []
}))
