import type { TVModel } from './model'
import * as Network from './network'
import type { Subscription } from 'algebraic-fx'

// import { subs as calibrationSubs } from './calibration/subs'
import { mapSub } from 'algebraic-fx'
import type { TVEnv } from './env'
import type { TVMsg } from './msg'

export const subs = (model: TVModel): Subscription<TVEnv, TVMsg>[] => {
  return [
    ...Network.subs(model.network)
    //   , ...calibrationSubs(model.calibration)
  ]
  // return Network.subs(model.network).map((s) =>
  //   mapSub(s, (msg) => ({ type: 'NETWORK', msg }) as TVMsg)
  // )
}
