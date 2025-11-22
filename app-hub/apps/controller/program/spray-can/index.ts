import type { Program } from 'algebraic-js'
import type { Model, Msg } from './types.js'
import { init } from './init.js'
import { update } from './update.js'
import { view } from './view.js'

/**
 * Controller spray-can program.
 * Sends spray events to TV via WebSocket using sendMsg().
 */
export const program: Program<Model, Msg> = {
  init,
  update,
  view
}
