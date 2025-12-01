// tv/pac-man/init.ts
import { IO } from 'algebraic-js'
import { createMaze } from './maze'
import type { Model, Pac, Ghost } from './types'

const createPac = (): Pac => ({
  pos: { x: 9, y: 16 },
  dir: 'right', // Start with right direction
  nextDir: null,
  speed: 4,
  isInvulnerable: true
})

const createGhosts = (): Ghost[] => [
  {
    name: 'Blinky',
    pos: { x: 9, y: 8 },
    dir: 'right',
    color: '#f97373',
    ai: 'chase'
  },
  {
    name: 'Pinky',
    pos: { x: 9, y: 10 },
    dir: 'left',
    color: '#fb7185',
    ai: 'ambush'
  },
  {
    name: 'Inky',
    pos: { x: 7, y: 10 },
    dir: 'right',
    color: '#22d3ee',
    ai: 'flank'
  },
  {
    name: 'Clyde',
    pos: { x: 11, y: 10 },
    dir: 'left',
    color: '#aacc15',
    ai: 'random'
  }
]

export const init = IO<{ model: Model; effects: any[] }>(() => {
  return {
    model: {
      maze: createMaze(),
      pac: createPac(),
      ghosts: createGhosts(),
      lastUpdate: performance.now(),
      frameCount: 0,
      gameReady: false,
      score: 0,
      lives: 3
    },
    effects: []
  }
})
