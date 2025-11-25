import { MessageType } from '@shared/types'
import type { Dispatch } from 'algebraic-js'

export const update = (payload, model, dispatch: Dispatch) => {
  switch (payload.type) {
    // set current spray color from controller
    case MessageType.SPRAY_START:
      return { model: { ...model, color: payload.msg.color }, effects: [] }

    // add spray dots around current pointer position
    case MessageType.SPRAY_POINT: {
      const px = model.pointer?.x ?? window.innerWidth / 2
      const py = model.pointer?.y ?? window.innerHeight / 2

      const radius = 10 // tighten to roughly half the pointer size
      const dotCount = 4 // fewer, denser dots per tick

      const newDots = Array.from({ length: dotCount }, () => {
        // random point within circle (uniform distribution)
        const angle = Math.random() * 2 * Math.PI
        const r = Math.sqrt(Math.random()) * radius
        const dx = Math.cos(angle) * r
        const dy = Math.sin(angle) * r
        return {
          x: px + dx,
          y: py + dy,
          color: model.color,
          size: 4 + Math.random() * 3,
          opacity: 0.7 + Math.random() * 0.2
        }
      })

      const maxDots = 1500
      const dots = [...model.dots, ...newDots]
      if (dots.length > maxDots) dots.splice(0, dots.length - maxDots)

      return {
        model: { ...model, dots },
        effects: []
      }
    }

    // stop spraying
    case MessageType.SPRAY_END:
      return { model: { ...model, spraying: false }, effects: [] }

    default:
      return { model, effects: [] }
  }
}
