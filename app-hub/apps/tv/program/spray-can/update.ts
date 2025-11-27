import { MessageType } from '@shared/types'
import { drawSprayIO } from './draw'

export const update = (msg, spray) => {
  switch (msg.type) {
    // INTERNAL       --------------------------------------------------------
    case 'INTERNAL_SPRAY_TICK': {
      const maxDots = 1500
      const dots = [...spray.dots, ...msg.msg.dots]
      const trimmed =
        dots.length > maxDots ? dots.slice(dots.length - maxDots) : dots

      const nextSpray = {
        ...spray,
        dots: trimmed
      }

      return {
        model: nextSpray,
        effects: [drawSprayIO(nextSpray)]
      }
    }

    // COLOR CHANGE  ---------------------------------------------------------
    case MessageType.SPRAY_START: {
      const { id, color } = msg.msg

      return {
        model: {
          ...spray,
          colors: {
            ...spray.colors,
            [id]: color
          }
        },
        effects: []
      }
    }

    // POINT/END DO NOT update spray state here (they update parent)
    case MessageType.SPRAY_POINT:
    case MessageType.SPRAY_END:
      return { model: spray, effects: [] }

    default:
      return { model: spray, effects: [] }
  }
}
