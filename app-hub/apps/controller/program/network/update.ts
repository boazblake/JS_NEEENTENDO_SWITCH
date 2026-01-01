import type { NetworkModel, NetworkMsg } from './types'

export const update = (msg: NetworkMsg, model: NetworkModel) => {
  switch (msg.type) {
    case 'Enable':
      return { model: { status: 'connecting', url: msg.url }, effects: [] }

    case 'Disable':
      return { model: { status: 'disconnected', url: null }, effects: [] }

    case 'Connected':
      return { model: { ...model, status: 'connected' }, effects: [] }

    case 'Disconnected':
      return { model: { ...model, status: 'disconnected' }, effects: [] }

    case 'Inbound':
      return { model, effects: [] }

    case 'Send':
      return { model, effects: [] }

    default:
      return { model, effects: [] }
  }
}
