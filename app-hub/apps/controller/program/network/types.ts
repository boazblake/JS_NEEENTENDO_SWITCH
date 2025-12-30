import type { Payload } from '@shared/types'

export type NetworkModel = {
  status: 'disconnected' | 'connected'
  url: string | null
}

export type NetworkMsg =
  | { type: 'Enable'; url: string }
  | { type: 'Connected' }
  | { type: 'Disconnected' }
  | { type: 'Inbound'; msg: Payload }
