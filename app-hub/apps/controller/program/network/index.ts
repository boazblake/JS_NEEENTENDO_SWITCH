import { init } from './init'
import { update } from './update'
import { wsSub, send } from './subs'
import type { NetworkModel } from './types'

export { init, update, send }
export const subs = (model: NetworkModel) => wsSub(model)
export * from './types'