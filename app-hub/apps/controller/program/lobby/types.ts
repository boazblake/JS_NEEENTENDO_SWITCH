export type Model = {
  availableTvs: string[]
  connectedTv: string
}

export type Msg =
  | { type: 'NETWORK_IN'; payload: any }
  | { type: 'ACK_PLAYER'; id: string; slot: number }
