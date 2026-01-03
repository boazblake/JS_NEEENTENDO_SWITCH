import type { Dispatch, RawEffect } from 'algebraic-fx'
import { send } from '../network/'
import type { Model, Msg } from './types'

export const update = (
  payload: payload,
  model: Model,
  dispatch: Dispatch,
  ctx: Model
) => {
  switch (payload.type) {
    case 'ENABLE_MOTION':
      let m = model
      m.enabled = true
      return { model: m, effects: [] }

    case 'MOTION_EVENT': {
      console.log('motion', ctx)
      const { quaternion, gravity, rotation } = payload.msg
      const next: Model = { ...model, quaternion, gravity, rotation }
      dispatch({
        type: 'NETWORK.SENSOR.MOTION',
        msg: {
          quaternion,
          gravity,
          rotation,
          session: ctx.session,
          id: ctx.name
        },
        t: payload.t
      })

      return { model: next, effects: [] }
    }

    default:
      return { model, effects: [] }
  }
}
