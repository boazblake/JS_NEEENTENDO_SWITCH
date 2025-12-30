import type { Program } from 'algebraic-fx'
import type { TVEnv } from './env'
import type { TVModel, TVMsg } from './types'

import { init } from './init'
import { update } from './update'
import { subs } from './subs'
import { view } from './view'

export const program: Program<TVModel, TVMsg, TVEnv> = {
  init,
  update,
  subs,
  view
}
