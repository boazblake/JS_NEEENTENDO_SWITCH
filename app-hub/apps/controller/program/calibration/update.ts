import { IO, Dispatch, runDomIO } from 'algebraic-fx'
import { startMotion } from './effects.js'
import { sendMsg } from '@effects/network'
import { MessageType, Screen } from '@shared/types'
import { wrapScreenOut } from '@shared/utils'
import type { Model, Msg } from './types.js'
import { env } from '../../main.ts'

export const update = (msg: Msg, model: Model, dispatch: Dispatch) => {
  switch (msg.type) {
    case 'ENABLE_MOTION':
      return { model, effects: [startMotion(dispatch)] }

    case 'MOTION_EVENT': {
      const { quaternion, gravity, rotation, timestamp } = msg
      const next = { ...model, quaternion, gravity, rotation, timestamp }
      const { session, id } = env
      // child wraps outbound calibration data for its parent
      const screenOut = IO(() =>
        dispatch(
          wrapScreenOut(Screen.CALIBRATION, {
            session,
            id,
            type: MessageType.CALIB_UPDATE,
            msg: {
              gravity,
              quaternion,
              rotation,
              timestamp
            }
          })
        )
      )
      return { model: next, effects: [screenOut] }
    }

    default:
      return { model, effects: [] }
  }
}
