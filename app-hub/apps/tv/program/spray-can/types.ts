// tv/spray-can/types.ts
export type Dot = {
  x: number
  y: number
  color: string
  size: number
  opacity: number
}

export type Model = {
  dots: Dot[]
  colors: Record<string, string>
}
