import type { Model as LobbyModel } from './lobby/types.js'
import type { Model as MenuModel } from './menu/types.js'
import type { Model as CalibrationModel } from './calibration/types.js'
import type { Model as SprayModel } from './spray-can/types.js'
import { Screen } from '@shared/types'

export type ControllerState = {
  pointer: PointerState
  player: { id: string; name: string; slot: number } | null
  spraying: boolean
}

export type Model = {
  session: string
  screen: Screen

  controllers: Record<string, ControllerState>

  screenW: number
  screenH: number

  spray: SprayModel
  sprayDrawLoopStarted: boolean

  lobby: LobbyModel
  menu: MenuModel
  calibration: CalibrationModel
}
export type ActionRect = {
  id: string
  rect: { x: number; y: number; w: number; h: number }
}

export type PointerState = {
  x: number
  y: number
  hoveredId: string | null
}

export type PlayerState = {
  id: string
  name: string
  slot: number
}
