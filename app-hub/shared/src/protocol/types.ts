export type ProtocolVersion = 1

export type Role = 'tv' | 'controller'

export type MessageMap = {
  register: {
    role: Role
    id: string
    session?: string
  }

  registered: {
    session: string
  }

  rejected: {
    reason: string
  }

  action: {
    name: string
    payload: unknown
  }

  state: {
    payload: unknown
  }

  error: {
    message: string
  }

  ping: {}

  pong: {}
}

export type WireEnvelope<T extends keyof MessageMap> = {
  v: ProtocolVersion
  type: T
  msg: MessageMap[T]
}

export type WireMsg = {
  [K in keyof MessageMap]: WireEnvelope<K>
}[keyof MessageMap]
