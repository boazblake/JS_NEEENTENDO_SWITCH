import type { Program } from 'algebraic-js'
import type { Model, Msg } from './types.js'
import { init } from './init.js'
import { update } from './update.js'
import { view } from './view.js'

export const createProgram: Program<Model, Msg> = {
  init,
  update,
  view
}
