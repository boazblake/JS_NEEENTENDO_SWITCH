export type Model = { x: number; y: number; alpha: number }

export type Msg =
  | { type: 'MOTION'; alpha: number; x: number; y: number }
  | { type: 'NETWORK_IN'; payload: any }
