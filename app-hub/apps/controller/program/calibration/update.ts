import { IO, Dispatch, runDomIO } from 'algebraic-js'
import { startMotion } from './effects.js'
import { sendMsg } from '@effects/network'
import { MessageType, Screen } from '@shared/types'
import { wrapScreenOut } from '@shared/utils'
import type { Model, Msg } from './types.js'
import { env } from '../../main.ts'

export const update = (msg: Msg, model: Model, dispatch: Dispatch) => {
  console.log('calib child update', msg, model)
  switch (msg.type) {
    case 'ENABLE_MOTION':
      return { model, effects: [startMotion(dispatch)] }

    case 'MOTION_EVENT': {
      const { quaternion, gravity } = msg
      const next = { ...model, quaternion, gravity }
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
              quaternion
            }
          })
        )
      )
      console.log('screen-out-motion', screenOut)
      return { model: next, effects: [screenOut] }
    }

    default:
      return { model, effects: [] }
  }
}
