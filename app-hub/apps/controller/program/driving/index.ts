import type { Program } from 'algebraic-fx'
import type { Model, Msg } from './types.js'
import { init } from './init.js'
import { update } from './update.js'
import { view } from './view.js'

export const program: Program<Model, Msg> = { init, update, view }
