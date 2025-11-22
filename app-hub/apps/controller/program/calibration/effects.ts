import { IO, type Dispatch } from 'algebraic-js'
// import { wrapScreenOut } from '@shared/utils'
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
          // const [gx, gy, gz] = gravity
          // const x = clamp((gx + 1) / 2, 0, 1)
          // const y = clamp(1 - (gy + 1) / 2, 0, 1)
          //
          // const payload = {
          //   type: MessageType.CALIB_UPDATE,
          //   x,
          //   y,
          //   gravity: [gx, gy, gz]
          // }

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

    // cleanup returned only after Motion.start and listener set up
    return () => {
      remove?.()
      Motion.stop()
      console.log('[startMotion] stopped native motion')
    }
  })

// // 1. Translate one browser event into a message
// export const handleOrientationEvent =
//   (dispatch: (m: any) => void) => (e: DeviceOrientationEvent) => {
//     if (!e || e.alpha == null || e.beta == null || e.gamma == null) return
//     const x = (e.gamma + 90) / 180
//     const y = (e.beta + 90) / 180
//     dispatch({
//       type: Screen.CALIBRATION,
//       msg: {
//         type: 'MOTION_EVENT',
//         alpha: e.alpha,
//         x,
//         y
//       }
//     })
//   }
//
// export const registerMotionListenerIO = (dispatch: Dispatch) =>
//   Reader<DomEnv, IO<() => void>>((env) =>
//     IO(() => {
//       const deviceorientation = handleOrientationEvent(dispatch)
//
//       env.window.addEventListener('deviceorientation', deviceorientation)
//       deviceorientation() // emit immediately on mount
//
//       return () =>
//         env.window.removeEventListener('deviceorientation', deviceorientation)
//     })
//   )
//
// // // 2. Describe registering that listener
// // export const registerMotionListenerIO = (dispatch: Dispatch) =>
// //   IO(() => {
// //     const listener = handleOrientationEvent(dispatch)
// //     window.addEventListener('deviceorientation', listener)
// //     // return a cancellation function
// //     return () => window.removeEventListener('deviceorientation', listener)
// //   })
//
// // IO that requests permission, then dispatches a message based on the result
// export const requestPermissionIO = (dispatch: Dispatch) =>
//   IO(() => {
//     if (
//       typeof DeviceMotionEvent !== 'undefined' &&
//       typeof (DeviceMotionEvent as any).requestPermission === 'function'
//     ) {
//       ;(DeviceMotionEvent as any)
//         .requestPermission()
//         .then((res: string) =>
//           dispatch({
//             type: Screen.CALIBRATION,
//             msg: {
//               type:
//                 res === 'granted' ? 'PERMISSION_GRANTED' : 'PERMISSION_DENIED'
//             }
//           })
//         )
//         .catch(() =>
//           dispatch({
//             type: {
//               type: Screen.CALIBRATION,
//               msg: { type: 'PERMISSION_DENIED' }
//             }
//           })
//         )
//     } else {
//       // non-iOS browsers grant automatically
//       dispatch({
//         type: Screen.CALIBRATION,
//         msg: { type: 'PERMISSION_GRANTED' }
//       })
//     }
//   })
