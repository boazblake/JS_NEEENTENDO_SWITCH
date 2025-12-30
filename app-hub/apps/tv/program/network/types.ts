import type { WireMsg } from '@shared/protocol'

export type NetworkModel = {
  status: 'disconnected' | 'connecting' | 'connected'
  url: string | null
}

export type NetworkMsg =
  | { type: 'Enable'; url: string }
  | { type: 'Disable' }
  | { type: 'Connected' }
  | { type: 'Disconnected' }
  | { type: 'Inbound'; msg: WireMsg }
  | { type: 'Send'; msg: WireMsg }
