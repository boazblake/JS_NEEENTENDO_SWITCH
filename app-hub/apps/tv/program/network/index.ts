import { init } from './init'
import { update } from './update'
import { wsSub } from './subs'
import type { NetworkModel } from './types'

export { init, update }

export const subs = (model: NetworkModel) => wsSub(model)
export * from './types'
