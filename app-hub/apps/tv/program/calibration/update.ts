import { type Dispatch } from 'algebraic-fx'
import { MessageType, ScreenIn, CalibUpdate } from '@shared/types'
import type { Model, Msg, Payload } from './types.js'
import { drawControllerReaderIO } from './model.ts'

export const update = (payload: Payload, model: Model, dispatch: Dispatch) => {
  console.log(payload, model)
  switch (payload.type) {
    case 'FLIP_PY':
      return { model: { ...model, flipPY: !model.flipPY }, effects: [] }

    case MessageType.CALIB_UPDATE:
      const p = payload.msg as CalibUpdate
      const { q, g, r } = p
      console.log({ q, g, r })
      return {
        model,
        effects: [drawControllerReaderIO(q, g, r)]
      }

    default:
      return { model, effects: [] }
  }
}
