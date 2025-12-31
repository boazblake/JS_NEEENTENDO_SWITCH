export type ClientToServer =
  | {
      type: 'handshake'
      role: 'controller' | 'tv'
      clientId: string
    }
  | {
      type: 'input'
      input:
        | { kind: 'button'; button: string; pressed: boolean }
        | { kind: 'axis'; axis: string; value: number }
    }

export type ServerToClient =
  | { type: 'ack'; clientId: string }
  | { type: 'state-sync'; state: unknown }
  | { type: 'control'; command: 'pause' | 'resume' | 'reset' }
