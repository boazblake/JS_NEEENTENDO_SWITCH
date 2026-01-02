import type { Payload } from '@shared/types'

export type Model = {
  markers: Record<string, unknown>
  flipPY: boolean
}

export type Msg = Payload | { type: 'FLIP_PY' }
