export type Model = {
  items: { id: string; label: string; screen: string }[]
}

export type Screen = 'lobby' | 'menu' | 'calibration' | 'spraycan' | 'wordpond'

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

// Child slice models (imported from children)
import type { Model as LobbyModel } from './lobby/types'
import type { Model as MenuModel } from './menu/types'
import type { Model as CalibrationModel } from './calibration/types'
import type { Model as SprayModel } from './spray-can/types'
import type { Model as WordPondModel } from './word-pond/types'

export type TVModel = {
  session: string
  screen: Screen

  controllers: Record<string, ControllerState>
  screenW: number
  screenH: number

  actions: ActionRect[]
  players: PlayerState[]

  lobby: LobbyModel
  menu: MenuModel
  calibration: CalibrationModel
  spray: SprayModel
  wordpond: WordPondModel
}

// CTX = full parent model
export type TVCtx = TVModel
