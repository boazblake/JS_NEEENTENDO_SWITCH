import type { Model as LobbyModel } from './lobby/types.js'
import type { Model as MenuModel } from './menu/types.js'
import type { Model as CalibrationModel } from './calibration/types.js'
import type { Model as SprayModel } from './spray-can/types.js'
import { Screen } from '@shared/types'


export type Model = {
  id: string
  name: string
  session: string
  status: 'idle' | 'connecting' | 'connected'
  screen: Screen
  lobby: any
  menu: any
  calibration: any
  spray: any
}
}

export type Msg =
  | { type: 'NETWORK_IN'; payload: any }
  | { type: 'NAVIGATE'; to: Model['screen'] }
  | { screen: Screen.LOBBY; type: Screen.LOBBY; msg: any }
  | { screen: Screen.MENU; type: Screen.MENU; msg: any }
  | { screen: Screen.CALIBRATION; type: Screen.CALIBRATION; msg: any }
  | { screen: Screen.SPRAYCAN; type: Screen.SPRAYCAN; msg: any }
