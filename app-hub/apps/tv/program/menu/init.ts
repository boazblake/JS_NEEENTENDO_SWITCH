// tv/menu/init.ts
import { IO } from 'algebraic-fx'
import type { Model } from './types'

export const init = IO<{ model: Model; effects: any[] }>(() => ({
  model: {
    items: [
      { id: 'calibration', label: 'Calibration', screen: 'calibration' },
      { id: 'spraycan', label: 'Spray Can', screen: 'spraycan' },
      { id: 'wordpond', label: 'Word Pond', screen: 'wordpond' },
      { id: 'lobby', label: 'Back to Lobby', screen: 'lobby' },
      { id: 'pacman', label: 'pacman', screen: 'pacman' },
      { id: 'driving', label: 'drive!', screen: 'driving' }
    ]
  },
  effects: []
}))
