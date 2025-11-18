import type { Model as LobbyModel } from './lobby/types.js'
import type { Model as MenuModel } from './menu/types.js'
import type { Model as CalibrationModel } from './calibration/types.js'
import type { Model as SprayModel } from './spray-can/types.js'

export type Player = { id: string; name: string; slot: number }

export type Model = {
  session: string
  players: Record<string, Player>
  status: 'idle' | 'connected'
  screen: 'lobby' | 'menu' | 'calibration' | 'spraycan'
  lobby: LobbyModel
  menu: MenuModel
  calibration: CalibrationModel
  spray: SprayModel
}
