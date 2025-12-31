import type { NetworkModel, NetworkMsg } from './types'

export const update = (msg: NetworkMsg, model: NetworkModel) => {
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
    case 'Disable':
      return {
        model: { status: 'disconnected', url: null },
        effects: []
      }

    case 'Inbound':
    case 'Send':
      return { model, effects: [] }

    default:
      return { model, effects: [] }
  }
}
