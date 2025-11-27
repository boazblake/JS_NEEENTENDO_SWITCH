import type { Model, Msg } from './types.js'
export const update = (msg: Msg, model: Model) => {
  return { model, effects: [] }
}
