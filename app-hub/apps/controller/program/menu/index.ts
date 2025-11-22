import type { Program } from 'algebraic-js '
import { init } from './init.js'
import { update } from './update.js'
import { view } from './view.js'
export const program: Program<any, any> = { init, update, view }
