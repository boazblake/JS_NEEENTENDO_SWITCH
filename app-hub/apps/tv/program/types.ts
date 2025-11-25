import type { Model as LobbyModel } from './lobby/types.js'
import type { Model as MenuModel } from './menu/types.js'
import type { Model as CalibrationModel } from './calibration/types.js'
import type { Model as SprayModel } from './spray-can/types.js'
import { Screen } from '@shared/types'

export type Player = { id: string; name: string; slot: number }

export type Model = {
  tvId: string
  screen: Screen
  players: { id: string; name: string }[]
  gameState: Record<string, any>
}
