import type { Payload, Screen as SharedScreen } from '@shared/types'
import type { NetworkModel, NetworkMsg } from './network'
import type { Model as ControllersModel } from './controllers/'

export type TVScreen = SharedScreen

export type PointerState = {
  x: number
  y: number
  hoveredId: string | null
}

export type ControllerState = {
  pointer: PointerState
  player: { id: string; name: string; slot: number } | null
  spraying: boolean
}

export type ActionRect = {
  id: string
  rect: { x: number; y: number; w: number; h: number }
}

export type PlayerState = {
  id: string
  name: string
  slot: number
}

// import type { Model as LobbyModel } from './lobby/types'
import type { Model as MenuModel } from './menu/types'
import type { Model as CalibrationModel } from './calibration/types'
import type { Model as SprayModel } from './spray-can/types'
import type { Model as WordPondModel } from './word-pond/types'
import type { Model as DrivingModel } from './driving/types'
import type { Model as PacManModel } from './pac-man/types'

export type TVModel = {
  session: string
  screen: TVScreen

  controllers: ControllersModel
  screenW: number
  screenH: number

  actions: ActionRect[]
  players: PlayerState[]

  // lobby: LobbyModel
  menu: MenuModel | null
  calibration: CalibrationModel | null
  spray: SprayModel | null
  wordpond: WordPondModel | null
  driving: DrivingModel | null
  pacman: PacManModel | null

  network: NetworkModel
}

export type TVContext = {
  session: string
  screenW: number
  screenH: number
  controllers: ControllersModel['controllers']
  actions: ActionRect[]
  players: PlayerState[]
}

export type TVMsg =
  | Payload
  | { type: 'NETWORK'; msg: NetworkMsg }
  | { type: 'Shutdown'; msg: {} }
