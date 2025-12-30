import type { NetworkModel, NetworkMsg } from './types'

export const update = (msg: NetworkMsg, model: NetworkModel) => {
  switch (msg.type) {
    case 'Enable':
      return {
        model: { status: 'disconnected', url: msg.url },
        effects: []
      }

    case 'Connected':
      return {
        model: { ...model, status: 'connected' },
        effects: []
      }

    case 'Disconnected':
      return {
        model: { ...model, status: 'disconnected' },
        effects: []
      }

    case 'Inbound':
      return { model, effects: [] }

    default:
      return { model, effects: [] }
  }
}
