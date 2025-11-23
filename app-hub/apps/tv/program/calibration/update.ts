import { type Dispatch } from 'algebraic-js'
import { MessageType, ScreenIn, CalibUpdate } from '@shared/types'
import type { Model, Msg } from './types.js'
import { drawControllerReaderIO } from './model.ts'

export const update = (msg: Msg, model: Model, dispatch: Dispatch) => {
  switch (msg.type) {
    case MessageType.SCREEN_IN: {
      const payload = (msg as ScreenIn).payload
      switch (payload.type) {
        case 'FLIP_PY':
          return { model: { ...model, flipPY: !model.flipPY }, effects: [] }

        case MessageType.CALIB_UPDATE: {
          const p = payload.msg as CalibUpdate
          const { quaternion, gravity } = p
          return {
            model,
            effects: [drawControllerReaderIO(quaternion, gravity)]
          }
        }

        default:
          return { model, effects: [] }
      }
    }

    default:
      return { model, effects: [] }
  }
}
