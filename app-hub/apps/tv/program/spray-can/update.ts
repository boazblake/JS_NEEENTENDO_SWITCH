import { IO } from 'algebraic-js'
import { MessageType } from '@shared/types'
import type { Dispatch } from 'algebraic-js'
import { drawSprayIO } from './view' // if you use the canvas draw IO

export const update = (payload, fullModel, dispatch: Dispatch) => {
  const spray = fullModel.spray

  switch (payload.type) {
    // ------------------------------------------------------------
    // Start spraying (press down)
    // ------------------------------------------------------------
    case MessageType.SPRAY_POINT: {
      // run a repeating IO while active
      const loop = IO(() => {
        let active = true
        const tick = () => {
          if (!active) return

          const px = fullModel.pointer?.x ?? window.innerWidth / 2
          const py = fullModel.pointer?.y ?? window.innerHeight / 2
          const radius = 10
          const dotCount = 4

          const newDots = Array.from({ length: dotCount }, () => {
            const angle = Math.random() * 2 * Math.PI
            const r = Math.sqrt(Math.random()) * radius
            const dx = Math.cos(angle) * r
            const dy = Math.sin(angle) * r
            return {
              x: px + dx,
              y: py + dy,
              color: spray.color,
              size: 4 + Math.random() * 3,
              opacity: 0.7 + Math.random() * 0.2
            }
          })

          dispatch({
            type: 'INTERNAL_SPRAY_TICK',
            msg: { dots: newDots }
          })

          // keep ticking if still spraying
          setTimeout(tick, 16) // ~60 fps
        }

        tick()

        // return a stop function
        return () => {
          active = false
        }
      })

      return { ...spray, spraying: true, loop }
    }

    // ------------------------------------------------------------
    // Stop spraying (release)
    // ------------------------------------------------------------
    case MessageType.SPRAY_END:
      // stop the loop if it exists
      spray.loop?.run()?.()
      return { ...spray, spraying: false, loop: null }

    // ------------------------------------------------------------
    // Tick from the loop
    // ------------------------------------------------------------
    case 'INTERNAL_SPRAY_TICK': {
      const dots = [...spray.dots, ...payload.msg.dots]
      const maxDots = 1500
      if (dots.length > maxDots) dots.splice(0, dots.length - maxDots)
      return { ...spray, dots }
    }

    // ------------------------------------------------------------
    // Change color
    // ------------------------------------------------------------
    case MessageType.SPRAY_START:
      return { ...spray, color: payload.msg.color }

    default:
      return spray
  }
}
