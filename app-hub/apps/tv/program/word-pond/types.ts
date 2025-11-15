export type Model = {
  host: 'TV'
  players: Record<string, { id: string; name: string; slot?: number }>
  count: number
}

export type Msg =
  | { type: 'REGISTER_PLAYER'; id: string; name: string }
  | { type: 'ACK_PLAYER'; id: string; slot: number }
  | { type: 'NETWORK_IN'; payload: any }
  | { type: 'STATE_SYNC'; state: any }
