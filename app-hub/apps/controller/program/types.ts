export type Screen = 'lobby' | 'menu' | 'calibration' | 'spraycan' | 'wordpond'

import type { Model as LobbyModel } from './lobby/types'
import type { Model as MenuModel } from './menu/types'
import type { Model as CalibrationModel } from './calibration/types'
import type { Model as SprayModel } from './spray-can/types'
import type { Model as WordPondModel } from './word-pond/types'

export type ControllerModel = {
  id: string
  name: string
  session: string
  status: 'idle' | 'connecting' | 'connected'
  screen: Screen

  hoveredId?: string | null

  lobby: LobbyModel
  menu: MenuModel
  calibration: CalibrationModel
  spray: SprayModel
  wordpond: WordPondModel
}

// CTX = full parent model
export type ControllerCtx = ControllerModel
