import type { MessageMap, WireMsg } from './types'

const messageTypes: ReadonlySet<string> = new Set([
  'register',
  'registered',
  'rejected',
  'action',
  'state',
  'error',
  'ping',
  'pong'
])

export const isWireMsg = (x: unknown): x is WireMsg => {
  if (typeof x !== 'object' || x === null) return false

  const msg = x as any

  if (msg.v !== 1) return false
  if (typeof msg.type !== 'string') return false
  if (!messageTypes.has(msg.type)) return false
  if (typeof msg.msg !== 'object' || msg.msg === null) return false

  return true
}
