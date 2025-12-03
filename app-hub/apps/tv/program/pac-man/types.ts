// tv/pac-man/types.ts

export type Tile = 0 | 1 | 2

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

export type Player = {
  x: number
  y: number
  dx: number
  dy: number
  isInvulnerable: boolean
}

export type PowerUp = {
  x: number
  y: number
}

export type Token = {
  x: number
  y: number
}

export type PacManModel = {
  map: Tile[][]
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
  gameEnded: boolean
}

export type CalibUpdateMsg = {
  id: string
  g?: [number, number, number] | number[]
}

export type Payload =
  | { type: 'CALIB_UPDATE'; msg: CalibUpdateMsg }
  | { type: 'PACMAN_RESTART' }

// TV model is assumed to hold `pacman: PacManModel`
export type TVModelWithPacMan = {
  pacman: PacManModel
}
