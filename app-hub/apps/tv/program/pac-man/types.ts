// tv/pac-man/types.ts

import type { MAP } from './map'

export type Tile = 0 | 1 | 2

export type Player = {
  x: number
  y: number
  dx: number
  dy: number
  isInvulnerable: boolean
}

export type EnemyAI = 'chase' | 'ambush' | 'flank' | 'random'

export type Enemy = {
  name: string
  x: number
  y: number
  dx: number
  dy: number
  asset: string
  ai: EnemyAI
}

export type Token = {
  x: number
  y: number
}

export type PowerUp = {
  x: number
  y: number
}

export type PacmanModel = {
  map: typeof MAP
  player: Player | null
  enemies: Enemy[]
  tokens: Token[]
  powerUps: PowerUp[]
  score: number
  lives: number
  powerUpActive: boolean
  powerUpTimer: number
  frameCount: number
  gameReady: boolean
  initialized: boolean
}

export type CalibMsg = {
  id: string
  g?: number[]
}

export type PacmanPayload =
  | { type: 'CALIB_UPDATE'; msg: CalibMsg }
  | { type: 'TICK' }
