export type Model = {
  session: string
  connected: boolean
}

export type Msg =
  | { type: 'NETWORK_IN'; payload: any }
  | { type: 'ACK_PLAYER'; id: string; slot: number }
