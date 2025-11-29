// tv/spray-can/update.ts
import { MessageType } from '@shared/types'
import type { Model } from './types'
import type { TVCtx } from '../types'
import { drawSprayIO } from './draw'

export const update = (msg: any, model: Model, _dispatch: any, _ctx: TVCtx) => {
  switch (msg.type) {
    case 'INTERNAL_SPRAY_TICK': {
      const maxDots = 1500
      const dots = [...model.dots, ...msg.msg.dots]
      const trimmed =
        dots.length > maxDots ? dots.slice(dots.length - maxDots) : dots

      const next = { ...model, dots: trimmed }
      return { model: next, effects: [drawSprayIO(next)] }
    }

    case MessageType.SPRAY_START: {
      const { id, color } = msg.msg
      return {
        model: {
          ...model,
          colors: {
            ...model.colors,
            [id]: color
          }
        },
        effects: []
      }
    }

    case MessageType.SPRAY_POINT:
    case MessageType.SPRAY_END:
      return { model, effects: [] }

    default:
      return { model, effects: [] }
  }
}
