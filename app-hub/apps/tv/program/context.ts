import type { Model, TVContext } from './types'

export const makeTVContext = (model: Model): TVContext => ({
  session: model.session,
  screenW: model.screenW,
  screenH: model.screenH,
  controllers: model.controllers,
  actions: model.actions,
  players: model.players
})
