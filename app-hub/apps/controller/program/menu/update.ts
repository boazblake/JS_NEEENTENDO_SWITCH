// controller/menu/update.ts
import type { Model } from './types'
import type { ControllerCtx } from '../types'

export const update = (
  _msg: any,
  model: Model,
  _dispatch: any,
  _ctx: ControllerCtx
) => ({ model, effects: [] })
