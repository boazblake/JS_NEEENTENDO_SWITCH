import { IO } from 'algebraic-fx'
import { Screen } from '@shared/types'
import type { Model } from './types'

export const init = IO.IO(() => ({
  model: {
    screen: Screen.MENU
  } satisfies Model,
  effects: []
}))
