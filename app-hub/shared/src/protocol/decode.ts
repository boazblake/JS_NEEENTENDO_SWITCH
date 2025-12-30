import type { WireMsg } from './types'

export type DecodeError = {
  kind: 'DecodeError'
  reason: string
}

export const decode = (raw: unknown): WireMsg | DecodeError => {
  if (typeof raw !== 'string') {
    return { kind: 'DecodeError', reason: 'raw payload is not a string' }
  }

  try {
    return JSON.parse(raw) as WireMsg
  } catch {
    return { kind: 'DecodeError', reason: 'invalid JSON' }
  }
}
