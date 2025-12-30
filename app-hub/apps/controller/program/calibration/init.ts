import { IO } from 'algebraic-fx'
import type { Model } from './types.js'

export const init = IO.IO(() => ({
  model: {
    quaternion: [0, 0, 0, 0],
    gravity: [0, 0, 0],
    rotation: [0, 0, 0],
    timestamp: 0
  } as Model,
  effects: []
}))
