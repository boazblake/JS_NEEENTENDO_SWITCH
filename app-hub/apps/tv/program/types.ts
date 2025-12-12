import type { Payload, Screen as SharedScreen } from '@shared/types'

// Reuse shared Screen enum for the TV
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

// Child slice models
import type { Model as LobbyModel } from './lobby/types'
import type { Model as MenuModel } from './menu/types'
import type { Model as CalibrationModel } from './calibration/types'
import type { Model as SprayModel } from './spray-can/types'
import type { Model as WordPondModel } from './word-pond/types'
import type { Model as DrivingModel } from './driving/types'
import type { Model as PacManModel } from './pac-man/types'

export type TVModel = {
  session: string
  screen: TVScreen

  controllers: Record<string, ControllerState>
  screenW: number
  screenH: number

  actions: ActionRect[]
  players: PlayerState[]

  lobby: LobbyModel
  menu: MenuModel | null
  calibration: CalibrationModel | null
  spray: SprayModel | null
  wordpond: WordPondModel | null
  driving: DrivingModel | null
  pacman: PacManModel | null
}

// Context passed down to children
export type TVContext = {
  session: string
  screenW: number
  screenH: number
  controllers: Record<string, ControllerState>
  actions: ActionRect[]
  players: PlayerState[]
}

// Program message type for TV: shared network payload
export type TVMsg = Payload
