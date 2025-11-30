import type { Model } from './types'
import { MessageType } from '@shared/types'

// Controller receives its own CALIB_UPDATE echo
export const update = (msg: any, model: Model) => {
  if (msg.type === MessageType.CALIB_UPDATE) {
    const gx = Number(msg.g?.[0] ?? 0)
    const gy = Number(msg.g?.[1] ?? 0)

    const steer = Math.max(-1, Math.min(1, gx))
    const f = Math.max(0, gy)
    const b = Math.max(0, -gy)

    const throttle = Math.max(0, Math.min(1, f))
    const brake = Math.max(0, Math.min(1, b))

    return {
      model: { steer, throttle, brake },
      effects: []
    }
  }

  return { model, effects: [] }
}
