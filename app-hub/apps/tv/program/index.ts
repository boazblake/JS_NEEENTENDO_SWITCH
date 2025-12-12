import type { Program } from 'algebraic-fx/core/types.js'
import type { TVModel, TVMsg } from './types.js'
import type { TVEnv } from './env.js'
import { init } from './init.js'
import { update } from './update.js'
import { view } from './view.js'

export const program: Program<TVModel, TVMsg, TVEnv> = {
  init,
  update,
  view
}
