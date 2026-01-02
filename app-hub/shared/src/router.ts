import { splitRoute } from './utils'
import { MessageDomain } from './types'
import type { Payload } from './types'

type UpdateFn<M> = (
  payload: Payload,
  model: M
) => {
  model: M
  effects: any[]
}

type Routes<M> = Partial<Record<MessageDomain, UpdateFn<M>>>

export const routeByDomain = <RootModel>(
  payload: Payload,
  model: RootModel,
  routes: Routes<RootModel>
) => {
  const { domain, type } = splitRoute(payload.type)
  const route = routes[domain]

  if (!route) {
    return { model, effects: [] }
  }
  let t = payload.t ?? Date.now()
  console.log({ type, msg: payload.msg, t }, payload)
  return route({ type, msg: payload.msg, t }, model)
}
