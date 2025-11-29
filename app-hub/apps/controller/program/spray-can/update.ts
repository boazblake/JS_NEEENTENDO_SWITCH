// controller/spray-can/update.ts
import type { Model } from './types'
import type { ControllerCtx } from '../types'

export const update = (
  msg: any,
  model: Model,
  _dispatch: any,
  _ctx: ControllerCtx
) => {
  switch (msg.type) {
    case 'SET_COLOR':
      return { model: { ...model, color: msg.msg.color }, effects: [] }
    default:
      return { model, effects: [] }
  }
}
