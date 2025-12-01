import type { Model } from './types'
import type { ControllerCtx } from '../types'

export const update = (
  msg: any,
  model: Model,
  _dispatch: any,
  _ctx: ControllerCtx
) => {
  console.log('wtffff', msg)
  switch (msg.type) {
    case 'PACMAN_SET_DIR': {
      return { model: { ...model, dir: msg.msg.dir }, effects: [] }
    }
    default:
      return { model, effects: [] }
  }
}
