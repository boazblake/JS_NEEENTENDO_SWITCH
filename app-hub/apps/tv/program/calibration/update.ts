import type { Dispatch, RawEffect } from 'algebraic-fx'
import type { Payload } from '@shared/types'
import { makeDrawEffect } from './model'

export const update = (
  payload: Payload | { type: 'FLIP_PY' },
  model: Model,
  _dispatch: Dispatch
): { model: Model; effects: RawEffect<any>[] } => {
  console.log('in calib', payload)
  if (payload.type === 'FLIP_PY') {
    return { model: { ...model, flipPY: !model.flipPY }, effects: [] }
  }

  if (payload.type === 'SENSOR.MOTION') {
    const { quaternion, gravity, rotation } = payload.msg as any
    return { model, effects: [makeDrawEffect(quaternion, gravity, rotation)] }
  }

  return { model, effects: [] }
}
