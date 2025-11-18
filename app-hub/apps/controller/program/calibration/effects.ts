import { IO, Dispatch, Reader, DomEnv } from 'algebraic-js'
import { wrapScreenOut } from '@/shared/utils'
import { Screen } from '@/shared/types'

// 1. Translate one browser event into a message
export const handleOrientationEvent =
  (dispatch: (m: any) => void) => (e: DeviceOrientationEvent) => {
    if (!e || e.alpha == null || e.beta == null || e.gamma == null) return
    const x = (e.gamma + 90) / 180
    const y = (e.beta + 90) / 180
    dispatch({
      type: Screen.CALIBRATION,
      msg: {
        type: 'MOTION_EVENT',
        alpha: e.alpha,
        x,
        y
      }
    })
  }

export const registerMotionListenerIO = (dispatch: Dispatch) =>
  Reader<DomEnv, IO<() => void>>((env) =>
    IO(() => {
      const deviceorientation = handleOrientationEvent(dispatch)

      env.window.addEventListener('deviceorientation', deviceorientation)
      deviceorientation() // emit immediately on mount

      return () =>
        env.window.removeEventListener('deviceorientation', deviceorientation)
    })
  )

// // 2. Describe registering that listener
// export const registerMotionListenerIO = (dispatch: Dispatch) =>
//   IO(() => {
//     const listener = handleOrientationEvent(dispatch)
//     window.addEventListener('deviceorientation', listener)
//     // return a cancellation function
//     return () => window.removeEventListener('deviceorientation', listener)
//   })

// IO that requests permission, then dispatches a message based on the result
export const requestPermissionIO = (dispatch: Dispatch) =>
  IO(() => {
    if (
      typeof DeviceMotionEvent !== 'undefined' &&
      typeof (DeviceMotionEvent as any).requestPermission === 'function'
    ) {
      ;(DeviceMotionEvent as any)
        .requestPermission()
        .then((res: string) =>
          dispatch({
            type: Screen.CALIBRATION,
            msg: {
              type:
                res === 'granted' ? 'PERMISSION_GRANTED' : 'PERMISSION_DENIED'
            }
          })
        )
        .catch(() =>
          dispatch({
            type: {
              type: Screen.CALIBRATION,
              msg: { type: 'PERMISSION_DENIED' }
            }
          })
        )
    } else {
      // non-iOS browsers grant automatically
      dispatch({
        type: Screen.CALIBRATION,
        msg: { type: 'PERMISSION_GRANTED' }
      })
    }
  })
