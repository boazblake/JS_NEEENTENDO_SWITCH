import * as Network from './network'
import { subs as calibrationSubs } from './calibration/subs'
import type { Subscription } from 'algebraic-fx'
import type { ControllerEnv } from './env'
import type { Model, Msg } from './types'

export const subs = (model: Model): Subscription<ControllerEnv, Msg>[] => {
  return [...Network.subs(model.network), ...calibrationSubs(model.calibration)]
}
