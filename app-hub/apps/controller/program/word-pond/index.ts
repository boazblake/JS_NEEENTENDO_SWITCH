import type { Program } from 'algebraic-js'
import type { Model, Msg } from './types.js'
import { init } from './init.js'
import { update } from './update.js'
import { view } from './view.js'

export const createProgram = (ws: WebSocket): Program<Model, Msg> => ({
  init: init(),
  update: (msg, model, dispatch) => update(msg, model, dispatch, ws),
  view
})
