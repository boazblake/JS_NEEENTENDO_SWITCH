import type { WireMsg } from '@shared/protocol'

export type NetworkMsg =
  | { type: 'Enable'; url: string }
  | { type: 'Disable' }
  | { type: 'Inbound'; msg: WireMsg }
  | { type: 'Closed' }
