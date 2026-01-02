import type { NetworkModel, NetworkMsg } from './types'

export const update = (msg: NetworkMsg, model: NetworkModel) => {
  console.log('net', msg)
  switch (msg.type) {
    case 'Enable':
      return {
        model: { status: 'connecting', url: msg.url },
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

    default:
      return { model, effects: [] }
  }
}
