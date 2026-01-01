import type { Payload } from '@shared/types'

export type NetworkModel = {
  status: 'disconnected' | 'connecting' | 'connected'
  url: string | null
}

export type NetworkMsg =
  | { type: 'Enable'; url: string }
  | { type: 'Disable' }
  | { type: 'Connected' }
  | { type: 'Disconnected' }
  | { type: 'Inbound'; msg: Payload }
  | { type: 'Send'; msg: Payload }
