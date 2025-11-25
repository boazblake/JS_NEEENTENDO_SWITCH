import type { Model, Msg } from './types.js'
export const update = (msg: Msg, model: Model) => {
  console.log(msg, model)

  return { model, effects: [] }
}
