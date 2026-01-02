import { sub } from 'algebraic-fx'
import { Motion } from 'capacitor-native-motion'
import type { Msg } from './types'
import type { ControllerEnv } from '../env'

export const subs = (model: { enabled: boolean }) =>
  model.enabled ? [motionSub()] : []

const motionSub = () =>
  sub<ControllerEnv, Msg>('calibration:motion', (_env, dispatch) => {
    let remove: (() => void) | undefined
    let alive = true

    Motion.start({ hz: 60 })
      .then(() =>
        Motion.addListener(
          'motion',
          ({ quaternion, gravity, rotationRate, timestamp }) => {
            if (!alive) return
            dispatch({
              type: 'CALIBRATION.MOTION_EVENT',
              msg: { quaternion, gravity, rotation: rotationRate },
              t: timestamp
            })
          }
        )
      )
      .then((listener) => {
        remove = listener.remove
      })
      .catch((e) => console.error('[motionSub] failed', e))

    return () => {
      // alive = false
      remove?.()
      Motion.stop()
    }
  })
