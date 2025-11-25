import { MessageType } from '@shared/types'
import type { Dispatch } from 'algebraic-js'

export const update = (payload, fullModel, dispatch: Dispatch) => {
  console.log('[spray] update')

  // Always work from the child slice but read from fullModel if needed
  const spray = fullModel.spray

  switch (payload.type) {
    // -----------------------------------------------------------------------
    // Set current spray color from controller
    // -----------------------------------------------------------------------
    case MessageType.SPRAY_START:
      return { ...spray, color: payload.msg.color }

    // -----------------------------------------------------------------------
    // Add spray dots around current pointer position
    // -----------------------------------------------------------------------
    case MessageType.SPRAY_POINT: {
      const px = fullModel.pointer?.x ?? window.innerWidth / 2
      const py = fullModel.pointer?.y ?? window.innerHeight / 2

      const radius = 10 // spray radius (tight cluster)
      const dotCount = 4 // dots per tick

      const newDots = Array.from({ length: dotCount }, () => {
        const angle = Math.random() * 2 * Math.PI
        const r = Math.sqrt(Math.random()) * radius // uniform density
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

      const maxDots = 1500
      const dots = [...spray.dots, ...newDots]
      if (dots.length > maxDots) dots.splice(0, dots.length - maxDots)

      return { ...spray, dots, spraying: true }
    }

    // -----------------------------------------------------------------------
    // Stop spraying
    // -----------------------------------------------------------------------
    case MessageType.SPRAY_END:
      return { ...spray, spraying: false }

    // -----------------------------------------------------------------------
    // Unknown / unhandled
    // -----------------------------------------------------------------------
    default:
      return spray
  }
}
