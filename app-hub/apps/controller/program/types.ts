import type { Model as LobbyModel } from './lobby/types.js'
import type { Model as MenuModel } from './menu/types.js'
import type { Model as CalibrationModel } from './calibration/types.js'
import type { Model as SprayModel } from './spray-can/types.js'
import { Screen } from '@/shared/types.js'

export type Model = {
  id: string
  name: string
  session: string
  status: 'idle' | 'connected'
  screen: Screen.LOBBY | Screen.MENU | Screen.CALIBRATION | Screen.SPRAYCAN
  lobby: LobbyModel
  menu: MenuModel
  calibration: CalibrationModel
  spray: SprayModel
}

export type Msg =
  | { type: 'NETWORK_IN'; payload: any }
  | { type: 'NAVIGATE'; to: Model['screen'] }
  | { type: Screen.LOBBY; msg: any }
  | { type: Screen.MENU; msg: any }
  | { type: Screen.CALIBRATION; msg: any }
  | { type: Screen.SPRAYCAN; msg: any }
