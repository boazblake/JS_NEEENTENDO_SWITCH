import { Screen } from '@shared/types'

export type PointerState = {
  x: number
  y: number
  hoveredId: string | null
  actions: {
    id: string
    rect: { x: number; y: number; w: number; h: number }
  }[]
}

export type ControllerState = {
  pointer: {
    x: number
    y: number
    hoveredId: string | null
  }

  sprayLoop: (() => void) | null // NEW
  spraying: boolean // NEW

  player: { id: string; name: string; slot: number } | null
}

export type Model = {
  session: string
  screen: Screen
  controllers: Record<string, ControllerState>

  screenW: number
  screenH: number

  menu: any
  lobby: any
  calibration: any
  spray: any
}
