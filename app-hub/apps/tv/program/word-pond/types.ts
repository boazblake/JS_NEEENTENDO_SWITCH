// tv/word-pond/types.ts
export type Letter = {
  id: string
  char: string
  x: number
  y: number
  vx: number
  vy: number
  caughtBy: string | null
}

export type Net = {
  id: string
  x: number
  y: number
}

export type Pond = {
  id: string
  letters: string[]
}

export type Model = {
  players: string[]
  letters: Letter[]
  nets: Record<string, Net>
  ponds: Record<string, Pond>
  targetWord: string
}
