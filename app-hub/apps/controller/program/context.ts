import type { Model, ControllerContext } from './types'

export const makeControllerContext = (model: Model): ControllerContext => ({
  id: model.id,
  session: model.session,
  status: model.status
})
