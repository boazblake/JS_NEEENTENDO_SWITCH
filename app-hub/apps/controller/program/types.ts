export type Model = {
  id: string
  name: string
  session: string
  slot?: number
  status: 'idle' | 'connected'
}

export type Msg =
  | { type: 'NETWORK_IN'; payload: any }
  | { type: 'ACK_PLAYER'; id: string; slot: number }
  | { type: 'JOINED' }
  | { type: 'NONE' }
