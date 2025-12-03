// tv/word-pond/init.ts
import { IO } from 'algebraic-fx'
import type { Model } from './types'

const rand = (a: number, b: number) => a + Math.random() * (b - a)

const createState = (): Model => {
  const w = window.innerWidth
  const h = window.innerHeight

  return {
    players: [],
    nets: {},
    ponds: {},
    targetWord: 'CAT',
    letters: Array.from({ length: 20 }, (_, i) => ({
      id: `L${i}`,
      char: String.fromCharCode(65 + Math.floor(Math.random() * 26)),
      x: Math.random() * w,
      y: Math.random() * (h * 0.6),
      vx: rand(-0.8, 0.8),
      vy: rand(0.2, 0.8),
      caughtBy: null
    }))
  }
}

export const init = IO<{ model: Model; effects: any[] }>(() => ({
  model: createState(),
  effects: []
}))
