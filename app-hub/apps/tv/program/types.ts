export type Player = { id: string; name: string; slot: number }

export type Model = {
  session: string
  players: Record<string, Player>
  status: 'idle' | 'connected'
}

export type Msg =
  | { type: 'NETWORK_IN'; payload: any }
  | { type: 'REGISTER_PLAYER'; id: string; name: string }
  | { type: 'SESSION_READY' }
  | { type: 'NONE' }
