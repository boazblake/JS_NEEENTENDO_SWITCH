// calibration/update.ts
import type { Dispatch, RawEffect } from 'algebraic-fx'
import { MessageType } from '@shared/types'
import type { Model, Msg } from './types'
import { makeDrawEffect } from './model'

export const update = (
  payload: Msg,
  model: Model,
  dispatch: Dispatch
): { model: Model; effects: RawEffect<any>[] } => {
  switch (payload.type) {
    case 'FLIP_PY':
      return {
        model: { ...model, flipPY: !model.flipPY },
        effects: []
      }

    case MessageType.CALIB_UPDATE: {
      const { q, g, r } = payload.msg
      return {
        model,
        effects: [makeDrawEffect(q, g, r)] // Valid RawEffect<E>
      }
    }

    default:
      return { model, effects: [] }
  }
}
