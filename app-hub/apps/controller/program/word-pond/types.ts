export type Model = {
  host: 'CONTROLLER'
  id?: string
  slot?: number
  name: string
}

export type Msg =
  | { type: 'REGISTER_PLAYER'; id: string; name: string }
  | { type: 'ACK_PLAYER'; id: string; slot: number }
  | { type: 'NETWORK_IN'; payload: any }
  | { type: 'STATE_SYNC'; state: any }
