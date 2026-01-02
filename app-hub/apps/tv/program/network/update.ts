import type { NetworkModel, NetworkMsg } from './types'
import type { Dispatch } from 'algebraic-fx'

export const update = (
  payload: NetworkMsg,
  model: NetworkModel,
  dispatch: Dispatch
) => {
  switch (payload.type) {
    case 'ENABLE':
      return {
        model: { status: 'connecting', url: payload.msg.url },
        effects: []
      }

    case 'Connected':
      return {
        model: { ...model, status: 'connected' },
        effects: []
      }

    case 'Disconnected':
      return {
        model: { status: 'disconnected', url: model.url },
        effects: []
      }

    case 'Send':
      // outbound is handled by the subscription
      return { model, effects: [] }

    case 'Inbound':
      return { model, effects: [] }

    case 'SENSOR.MOTION':
      dispatch({ type: 'CONTROLLERS.SENSOR.MOTION', msg: payload.msg })
      return { model, effects: [] }
    default:
      return { model, effects: [] }
  }
}
