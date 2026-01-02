import type { Program } from 'algebraic-fx'
import type { TVEnv } from '../env'
import type { Model, Msg } from './types'
import { init } from './init'
import { update } from './update'

export const program: Program<Model, Msg, TVEnv> = {
  init,
  update
}
