import { IO } from 'algebraic-js'
import type { Model } from './types.js'

export const init = IO(() => ({
  model: {
    quaternion: [0, 0, 0, 0],
    gravity: [0, 0, 0]
  } as Model,
  effects: []
}))
