// tv/pac-man/update.ts
import type { Dispatch } from 'algebraic-fx'
import type { TVCtx } from '../types'
import { drawPacmanIO } from './draw'
import type { PacManModel, Payload, PowerUp, Token, Enemy } from './types'

// ---------------------------------------------------------------------------
// Map (direct copy of browser version, tile-based)
// ---------------------------------------------------------------------------

const ROWS = 22
const COLS = 19

const MAP: PacManModel['map'] = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1],
  [1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1],
  [1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1],
  [1, 1, 1, 1, 0, 1, 0, 1, 1, 2, 1, 1, 0, 1, 0, 1, 1, 1, 1],
  [0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0],
  [1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1],
  [1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1],
  [1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1],
  [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
  [1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1],
  [1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
]

// ---------------------------------------------------------------------------
// Helpers to create initial state
// ---------------------------------------------------------------------------

const createPowerUps = (): PowerUp[] => [
  { x: 1, y: 3 },
  { x: 17, y: 3 },
  { x: 1, y: 16 },
  { x: 17, y: 16 }
]

const createTokens = (powerUps: PowerUp[]): Token[] => {
  const tokens: Token[] = []
  const powerSet = new Set(powerUps.map((p) => `${p.x},${p.y}`))

  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      if (MAP[y][x] === 0 && !powerSet.has(`${x},${y}`)) {
        tokens.push({ x, y })
      }
    }
  }
  return tokens
}

const resetCharacters = (model: PacManModel): void => {
  model.player = { x: 9, y: 16, dx: 0, dy: 0, isInvulnerable: true }

  // simple invulnerability timer: this is local-only visual rule, OK to keep here
  setTimeout(() => {
    if (model.player) model.player.isInvulnerable = false
  }, 2000)

  model.enemies = [
    {
      name: 'Confuso',
      x: 9,
      y: 8,
      dx: 1,
      dy: 0,
      asset: 'enemy_Confuso',
      ai: 'chase'
    },
    {
      name: 'Delaya',
      x: 9,
      y: 10,
      dx: -1,
      dy: 0,
      asset: 'enemy_Delaya',
      ai: 'ambush'
    },
    {
      name: 'MissyMatch',
      x: 7,
      y: 10,
      dx: 1,
      dy: 0,
      asset: 'enemy_MissyMatch',
      ai: 'flank'
    },
    {
      name: 'Forgotto',
      x: 11,
      y: 10,
      dx: -1,
      dy: 0,
      asset: 'enemy_Forgotto',
      ai: 'random'
    }
  ]
}

// ---------------------------------------------------------------------------
// SoundEngine stub (no-op)
// ---------------------------------------------------------------------------

const SoundEngine = {
  play: (_name: string) => {
    /* noop */
  }
}

// ---------------------------------------------------------------------------
// Public init helper for TV model
// ---------------------------------------------------------------------------

export const createPacManModel = (): PacManModel => {
  const powerUps = createPowerUps()
  const tokens = createTokens(powerUps)

  const model: PacManModel = {
    map: MAP,
    player: null,
    enemies: [],
    tokens,
    powerUps,
    score: 0,
    lives: 3,
    powerUpActive: false,
    powerUpTimer: 0,
    frameCount: 0,
    gameReady: false,
    gameEnded: false
  }

  resetCharacters(model)

  // staggered start flag, same as browser version
  setTimeout(() => {
    model.gameReady = true
  }, 500)

  return model
}

// ---------------------------------------------------------------------------
// Enemy AI helpers
// ---------------------------------------------------------------------------

const getEnemyTarget = (
  model: PacManModel,
  enemy: Enemy
): { x: number; y: number } => {
  const player = model.player
  const { powerUpActive } = model

  if (!player) {
    return { x: enemy.x, y: enemy.y }
  }

  if (powerUpActive) {
    return {
      x: Math.floor(Math.random() * COLS),
      y: Math.floor(Math.random() * ROWS)
    }
  }

  switch (enemy.ai) {
    case 'chase':
      return { x: player.x, y: player.y }
    case 'ambush':
      return { x: player.x + player.dx * 4, y: player.y + player.dy * 4 }
    case 'flank': {
      const blinky = model.enemies.find((e) => e.ai === 'chase')
      if (!blinky) return { x: player.x, y: player.y }

      const offsetX = player.x + player.dx * 2 - blinky.x
      const offsetY = player.y + player.dy * 2 - blinky.y
      return { x: blinky.x + offsetX * 2, y: blinky.y + offsetY * 2 }
    }
    case 'random': {
      const dist = Math.hypot(enemy.x - player.x, enemy.y - player.y)
      if (dist > 8) {
        return { x: player.x, y: player.y }
      }
      return { x: 0, y: ROWS - 1 }
    }
    default:
      return { x: player.x, y: player.y }
  }
}

const getBestMove = (
  entity: { x: number; y: number; dx: number; dy: number },
  target: { x: number; y: number }
): { dx: number; dy: number } | null => {
  const validMoves: { dx: number; dy: number }[] = []
  const { x, y, dx, dy } = entity

  if (MAP[y - 1] && MAP[y - 1][x] !== 1) validMoves.push({ dx: 0, dy: -1 })
  if (MAP[y + 1] && MAP[y + 1][x] !== 1) validMoves.push({ dx: 0, dy: 1 })
  if (MAP[y][x - 1] !== 1) validMoves.push({ dx: -1, dy: 0 })
  if (MAP[y][x + 1] !== 1) validMoves.push({ dx: 1, dy: 0 })

  const nonReversingMoves = validMoves.filter(
    (move) => (move.dx !== -dx || move.dy !== -dy) && validMoves.length > 1
  )

  const movesToConsider =
    nonReversingMoves.length > 0 ? nonReversingMoves : validMoves

  let bestMove: { dx: number; dy: number } | null = null
  let minDistance = Infinity

  for (const move of movesToConsider) {
    const distance = Math.hypot(x + move.dx - target.x, y + move.dy - target.y)
    if (distance < minDistance) {
      minDistance = distance
      bestMove = move
    }
  }

  return bestMove
}

// ---------------------------------------------------------------------------
// Step updates (frame based, same as browser)
// ---------------------------------------------------------------------------

const movePlayer = (model: PacManModel): void => {
  if (!model.player) return
  if (model.frameCount % 5 !== 0) return

  const player = model.player
  let newX = player.x + player.dx
  let newY = player.y + player.dy

  if (newX < 0) newX = COLS - 1
  if (newX >= COLS) newX = 0

  if (MAP[newY] && MAP[newY][newX] !== 1) {
    player.x = newX
    player.y = newY
  }
}

const moveEnemies = (model: PacManModel): void => {
  if (!model.player) return

  model.enemies.forEach((enemy) => {
    if (model.frameCount % 6 !== 0) return

    const target = getEnemyTarget(model, enemy)
    const bestMove = getBestMove(enemy, target)
    if (!bestMove) return

    enemy.dx = bestMove.dx
    enemy.dy = bestMove.dy
    enemy.x += enemy.dx
    enemy.y += enemy.dy
  })
}

const checkCollisions = (model: PacManModel): void => {
  const player = model.player
  if (!player) return

  model.tokens = model.tokens.filter((token) => {
    if (token.x === player.x && token.y === player.y) {
      model.score += 10
      SoundEngine.play('collect')
      return false
    }
    return true
  })

  let powerUpCollected = false
  model.powerUps.forEach((powerUp) => {
    if (powerUp.x === player.x && powerUp.y === player.y) {
      powerUpCollected = true
      model.powerUpActive = true
      model.powerUpTimer = 10 * 60
      SoundEngine.play('powerup')
    }
  })

  if (powerUpCollected) {
    model.powerUps = model.powerUps.filter(
      (p) => !(p.x === player.x && p.y === player.y)
    )
  }

  model.enemies.forEach((enemy) => {
    if (enemy.x === player.x && enemy.y === player.y) {
      if (model.powerUpActive) {
        model.score += 50
        SoundEngine.play('enemy')
        Object.assign(enemy, { x: 9, y: 10, dx: 1, dy: 0 })
      } else if (!player.isInvulnerable) {
        model.lives -= 1
        SoundEngine.play('die')
        if (model.lives === 0) {
          endGame(model, false)
        } else {
          resetCharacters(model)
        }
      }
    }
  })

  if (model.tokens.length === 0) {
    endGame(model, true)
  }
}

const updatePowerUp = (model: PacManModel): void => {
  if (!model.powerUpActive) return
  model.powerUpTimer -= 1
  if (model.powerUpTimer <= 0) {
    model.powerUpActive = false
  }
}

// ---------------------------------------------------------------------------
// End game
// ---------------------------------------------------------------------------

const endGame = (model: PacManModel, win: boolean): void => {
  model.gameEnded = true
  model.gameReady = false
  SoundEngine.play(win ? 'win' : 'lose')
}

// ---------------------------------------------------------------------------
// Tilt → direction mapping
// ---------------------------------------------------------------------------

const chooseDirFromTilt = (
  nx: number,
  ny: number
): { dx: number; dy: number } | null => {
  const ax = Math.abs(nx)
  const ay = Math.abs(ny)
  const dead = 0.15

  if (ax < dead && ay < dead) return null

  if (ax > ay) {
    return nx > 0 ? { dx: 1, dy: 0 } : { dx: -1, dy: 0 }
  }
  return ny > 0 ? { dx: 0, dy: 1 } : { dx: 0, dy: -1 }
}

// ---------------------------------------------------------------------------
// Main update entry (TV side)
// ---------------------------------------------------------------------------

export const update = (
  payload: Payload,
  model: PacManModel,
  _dispatch: Dispatch,
  ctx: TVCtx
): { model: PacManModel; effects: any[] } => {
  switch (payload.type) {
    case 'PACMAN_RESTART': {
      const next = createPacManModel()
      return { model: next, effects: [drawPacmanIO(next)] }
    }

    case 'CALIB_UPDATE': {
      const { id, g } = payload.msg
      if (!ctx.controllers[id]) return { model, effects: [] }

      if (!model.player || model.gameEnded) {
        return { model, effects: [] }
      }

      const gx = Number(g?.[0] ?? 0)
      const gy = Number(g?.[1] ?? 0)

      const nx = Math.max(-1, Math.min(1, gx / 9.81))
      const ny = Math.max(-1, Math.min(1, gy / 9.81))

      const dir = chooseDirFromTilt(nx, ny)
      if (dir) {
        model.player.dx = dir.dx
        model.player.dy = dir.dy
      }

      if (model.gameReady) {
        model.frameCount += 1
        movePlayer(model)
        moveEnemies(model)
        checkCollisions(model)
        updatePowerUp(model)
      }

      return { model, effects: [drawPacmanIO(model)] }
    }

    default:
      return { model, effects: [] }
  }
}
