import type { Model } from './types'
import { Screen } from '@shared/types'

export const init = (): Model => ({
  screen: Screen.LOBBY
})
