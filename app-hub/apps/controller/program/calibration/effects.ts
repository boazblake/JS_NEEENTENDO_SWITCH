import { IO, type Dispatch } from 'algebraic-js'
import { Motion } from '@boazblake/capacitor-motion'
import { MessageType, Screen } from '@shared/types'

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v))

export const startMotion = (dispatch: Dispatch) =>
  IO(async () => {
    console.log('[startMotion] starting native motion')

    let remove: (() => void) | undefined

    try {
      await Motion.start({ hz: 60 })
      console.log('[startMotion] Motion started')

      const sub = await Motion.addListener(
        'motion',
        ({ quaternion, gravity }) => {
          dispatch({
            type: Screen.CALIBRATION,
            msg: {
              type: 'MOTION_EVENT',
              quaternion,
              gravity
            }
          })
        }
      )

      remove = sub.remove
    } catch (e) {
      console.error('[startMotion] failed', e)
    }

    return () => {
      remove?.()
      Motion.stop()
      console.log('[startMotion] stopped native motion')
    }
  })
