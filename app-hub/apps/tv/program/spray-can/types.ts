export type Dot = {
  x: number
  y: number
  color: string
  size: number
  opacity: number
}

export type SprayModel = {
  dots: Dot[]
  color: string
}

type InternalSprayTick = {
  type: 'INTERNAL_SPRAY_TICK'
  msg: { dots: SprayModel['dots'] }
}

type Payload =
  | { type: MessageType.SPRAY_START; msg: { color: string } }
  | { type: MessageType.SPRAY_POINT; msg: { id: string } }
  | { type: MessageType.SPRAY_END; msg: { id: string } }
  | InternalSprayTick
