// tv/pac-man/init.ts
import { IO } from 'algebraic-fx'
import { MAP } from './map'
import type { Model, Pac, Ghost, Token, PowerUp } from './types'

/* ----------------------------------------------
   PLAYER
---------------------------------------------- */
const createPac = (): Pac => ({
  x: 9,
  y: 16,
  dx: 1, // start moving right
  dy: 0,
  isInvulnerable: true
})

/* ----------------------------------------------
   TOKENS
---------------------------------------------- */
const createPowerUps = (): PowerUp[] => [
  { x: 1, y: 3 },
  { x: 17, y: 3 },
  { x: 1, y: 16 },
  { x: 17, y: 16 }
]

const createTokens = (powerUps: PowerUp[]): Token[] => {
  const tokens: Token[] = []
  const powerSet = new Set(powerUps.map((p) => `${p.x},${p.y}`))

  for (let y = 0; y < MAP.length; y++) {
    for (let x = 0; x < MAP[0].length; x++) {
      if (MAP[y][x] === 0 && !powerSet.has(`${x},${y}`)) {
        tokens.push({ x, y })
      }
    }
  }
  return tokens
}

/* ----------------------------------------------
   GHOSTS
---------------------------------------------- */
const createGhosts = (): Ghost[] => [
  {
    name: 'Blinky',
    x: 9,
    y: 8,
    dx: 1,
    dy: 0,
    color: '#f97373',
    ai: 'chase'
  },
  {
    name: 'Pinky',
    x: 9,
    y: 10,
    dx: -1,
    dy: 0,
    color: '#fb7185',
    ai: 'ambush'
  },
  {
    name: 'Inky',
    x: 7,
    y: 10,
    dx: 1,
    dy: 0,
    color: '#22d3ee',
    ai: 'flank'
  },
  {
    name: 'Clyde',
    x: 11,
    y: 10,
    dx: -1,
    dy: 0,
    color: '#aacc15',
    ai: 'random'
  }
]

/* ----------------------------------------------
   INIT
---------------------------------------------- */
export const init = IO<{ model: Model; effects: any[] }>(() => {
  const powerUps = createPowerUps()
  const tokens = createTokens(powerUps)

  const model: Model = {
    map: MAP,

    pac: createPac(),
    enemies: createGhosts(),

    tokens,
    powerUps,

    score: 0,
    lives: 3,

    powerUpActive: false,
    powerUpTimer: 0,

    frameCount: 0,
    gameReady: false,
    gameEnded: false,

    lastUpdate: performance.now()
  }

  // Pac-Man is invulnerable for 2 seconds on start
  setTimeout(() => {
    model.pac.isInvulnerable = false
    model.gameReady = true
  }, 2000)

  return { model, effects: [] }
})
