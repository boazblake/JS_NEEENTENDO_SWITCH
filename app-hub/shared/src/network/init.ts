import type { NetworkModel } from './types'

export const init = (): NetworkModel => ({
  status: 'disconnected',
  url: null
})
