import { IO } from 'algebraic-js'
import type { Model } from './types.js'
import { Screen } from '@shared/types'

export const init = IO(() => ({
  model: {
    screen: Screen.MENU,
    pointer: { x: 0, y: 0 }
  } as Model,
  effects: []
}))
