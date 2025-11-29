// tv/menu/update.ts
import type { Model } from './types'
import type { TVCtx } from '../types'

export const update = (
  _msg: any,
  model: Model,
  _dispatch: any,
  _ctx: TVCtx
) => {
  return { model, effects: [] }
}
