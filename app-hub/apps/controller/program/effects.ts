import { IO, Reader, type Dispatch } from 'algebraic-js'
import { Motion } from '@boazblake/capacitor-motion'
import { MessageType } from '@shared/types'
import { sendMsg } from '@effects/network'

/**
 * Starts native motion stream and maps every Motion event
 * into an IO that sends CALIB_UPDATE through the Reader-provided ws.
 */
export const startAutoCalibration = (
  dispatch: Dispatch,
  id: string,
  session: string
) =>
  Reader((env) =>
    IO(async () => {
      console.log('[autoCalib] start', { id, session })
      let remove: (() => void) | undefined

      try {
        await Motion.start({ hz: 30 })

        const sub = await Motion.addListener(
          'motion',
          ({ quaternion, gravity }) => {
            const payload = {
              type: MessageType.CALIB_UPDATE,
              msg: { session, id, q: quaternion, g: gravity },
              t: Date.now()
            }

            // Create IO through Reader (still pure)
            const io = sendMsg(payload).run(env)
            // Interpret the IO in the same environment
            io.run()
          }
        )

        remove = sub.remove
      } catch (err) {
        console.error('[autoCalib] failed', err)
      }

      return () => {
        remove?.()
        Motion.stop()
        console.log('[autoCalib] stop')
      }
    })
  )
