import { MessageType } from '@/shared/types.js'

export type Model = {
  ctx: CanvasRenderingContext2D | null
  strokes: any[]
}

export type Msg =
  | { type: MessageType.NETWORK_IN; payload: any }
  | { type: MessageType.CLEAR_CANVAS }

export type SprayStart = {
  type: MessageType.SPRAY_START
  id: string
  color: string
}

export type SprayPoint = {
  type: MessageType.SPRAY_POINT
  id: string
  x: number
  y: number
  pressure: number
}

export type SprayEnd = {
  type: MessageType.SPRAY_END
  id: string
}

export type SprayMsg = SprayStart | SprayPoint | SprayEnd
