import type { Payload } from '@shared/types'

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

export type Model = Record<string, ControllerState>

export type Msg = Payload
