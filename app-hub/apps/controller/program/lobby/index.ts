import type { Program } from 'algebraic-js/core/types.js'
import type { Model, Msg } from './types.js'
import { init } from './init.js'
import { update } from './update.js'
import { view } from './view.js'

export const program: Program<Model, Msg> = { init, update, view }
