export type Model = {
  color: string
  spraying: boolean
}

export type Msg =
  | { type: 'NETWORK_IN'; payload: any }
  | { type: 'COLOR_CHANGED'; color: string }
  | { type: 'TRIGGER_START' }
  | { type: 'TRIGGER_MOVE'; x: number; y: number; pressure: number }
  | { type: 'TRIGGER_END' }

export type SprayStart = {
  type: 'SPRAY_START'
  id: string
  color: string
}

export type SprayPoint = {
  type: 'SPRAY_POINT'
  id: string
  x: number
  y: number
  pressure: number
}

export type SprayEnd = {
  type: 'SPRAY_END'
  id: string
}

export type SprayMsg = SprayStart | SprayPoint | SprayEnd
