import { MessageType } from '@shared/types'
import { drawSprayIO } from './draw'

export const update = (msg, spray) => {
  switch (msg.type) {
    case 'INTERNAL_SPRAY_TICK': {
      const dots = [...spray.dots, ...msg.msg.dots]
      const maxDots = 1500
      const trimmed =
        dots.length > maxDots ? dots.slice(dots.length - maxDots) : dots

      const nextSpray = { ...spray, dots: trimmed }

      return {
        model: nextSpray,
        effects: [drawSprayIO(nextSpray)]
      }
    }

    case MessageType.SPRAY_START: {
      const nextSpray = {
        ...spray,
        color: msg.msg.color
      }
      return { model: nextSpray, effects: [] }
    }

    default:
      return { model: spray, effects: [] }
  }
}
