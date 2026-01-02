import type { Payload } from '@shared/types'
import { MessageDomain } from '@shared/types'

export const SensorType = {
  MOTION: `${MessageDomain.SENSOR}.MOTION`
} as const

export type Model = {
  enabled: boolean
  quaternion: number[]
  gravity: number[]
  rotation: number[]
  timestamp: number
}

export type Msg =
  | { type: 'ENABLE_MOTION' }
  | {
      type: 'MOTION_EVENT'
      quaternion: number[]
      gravity: number[]
      rotation: number[]
      timestamp: number
    }
  | Payload
