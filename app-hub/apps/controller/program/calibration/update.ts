import { IO, Dispatch, runDomIO } from 'algebraic-js'
import { requestPermissionIO, registerMotionListenerIO } from './effects.js'
import { sendMsg } from '@/effects/network.js'
import { MessageType, Screen } from '@/shared/types.js'
import { wrapScreenOut } from '@/shared/utils.js'
import type { Model, Msg } from './types.js'
import { env } from '../../main.ts'

export const update = (msg: Msg, model: Model, dispatch: Dispatch) => {
  switch (msg.type) {
    case 'ENABLE_MOTION':
      return { model, effects: [requestPermissionIO(dispatch)] }

    case 'PERMISSION_GRANTED':
      return {
        model,
        effects: [runDomIO(registerMotionListenerIO(dispatch), env)]
      }
    // return { model, effects: [registerMotionListenerIO(dispatch)] }

    case 'PERMISSION_DENIED':
      return { model, effects: [] }

    case 'MOTION_EVENT': {
      const { alpha, x, y } = msg
      const next = { ...model, alpha, x, y }
      const { session, id } = env
      // child wraps outbound calibration data for its parent
      const screenOut = IO(() =>
        dispatch(
          wrapScreenOut(Screen.CALIBRATION, {
            type: MessageType.CALIB_UPDATE,
            session,
            id,
            alpha,
            x,
            y
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
