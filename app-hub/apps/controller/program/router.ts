import { splitRoute } from '@shared/utils'
import { MessageDomain } from '@shared/types'
import type { Payload } from '@shared/types'

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
  console.log({ type, msg: payload.msg, t: payload.t }, payload)
  return route({ type, msg: payload.msg, t: payload.t }, model)
}
