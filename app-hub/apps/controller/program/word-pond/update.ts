// controller/word-pond/update.ts
import type { Model } from './types'
import type { ControllerCtx } from '../types'
import { WordPondMsg } from '@shared/types'

export const update = (
  msg: any,
  model: Model,
  _dispatch: any,
  _ctx: ControllerCtx
) => {
  if (msg.type === WordPondMsg.STATE) {
    return { model: { ...model, state: msg.msg.state }, effects: [] }
  }
  return { model, effects: [] }
}
