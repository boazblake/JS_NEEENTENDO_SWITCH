// tv/pac-man/update.ts
import type { Model, Direction } from './types'
import type { TVCtx } from '../types'
import { isWall } from './maze'
import { drawPacmanIO } from './draw'

const dirVec = (d: Direction) => {
  switch (d) {
    case 'up':
      return { x: 0, y: -1 }
    case 'down':
      return { x: 0, y: 1 }
    case 'left':
      return { x: -1, y: 0 }
    case 'right':
      return { x: 1, y: 0 }
  }
}

const canMove = (maze: Model['maze'], x: number, y: number, d: Direction) => {
  const v = dirVec(d)
  const nx = x + v.x
  const ny = y + v.y
  return !isWall(maze, nx, ny)
}

const updatePac = (model: Model) => {
  if (model.frameCount % 5 !== 0) return

  const pac = model.pac
  const maze = model.maze

  // Try to turn if requested
  if (pac.nextDir && pac.nextDir !== pac.dir) {
    if (canMove(maze, pac.pos.x, pac.pos.y, pac.nextDir)) {
      pac.dir = pac.nextDir
      pac.nextDir = null
    }
  }

  // Move in current direction
  const v = dirVec(pac.dir)
  let nx = pac.pos.x + v.x
  let ny = pac.pos.y + v.y

  // Wrap around edges
  if (nx < 0) nx = maze.cols - 1
  if (nx >= maze.cols) nx = 0

  // Only move if not a wall
  if (!isWall(maze, nx, ny)) {
    pac.pos.x = nx
    pac.pos.y = ny
  }
}

const getEnemyTarget = (enemy: Model['ghosts'][0], model: Model) => {
  const { pac, maze } = model

  switch (enemy.ai) {
    case 'chase':
      return { x: pac.pos.x, y: pac.pos.y }

    case 'ambush': {
      const v = dirVec(pac.dir)
      return {
        x: Math.max(0, Math.min(maze.cols - 1, pac.pos.x + v.x * 4)),
        y: Math.max(0, Math.min(maze.rows - 1, pac.pos.y + v.y * 4))
      }
    }

    case 'flank': {
      const blinky = model.ghosts.find((g) => g.ai === 'chase')
      if (blinky) {
        const v = dirVec(pac.dir)
        const offsetX = pac.pos.x + v.x * 2 - blinky.pos.x
        const offsetY = pac.pos.y + v.y * 2 - blinky.pos.y
        return {
          x: blinky.pos.x + offsetX * 2,
          y: blinky.pos.y + offsetY * 2
        }
      }
      return { x: pac.pos.x, y: pac.pos.y }
    }

    case 'random': {
      const dist = Math.hypot(enemy.pos.x - pac.pos.x, enemy.pos.y - pac.pos.y)
      return dist > 8
        ? { x: pac.pos.x, y: pac.pos.y }
        : { x: 0, y: maze.rows - 1 }
    }

    default:
      return { x: pac.pos.x, y: pac.pos.y }
  }
}

const getBestMove = (
  enemy: Model['ghosts'][0],
  target: { x: number; y: number },
  maze: Model['maze']
): Direction | null => {
  const validMoves: { dir: Direction; dx: number; dy: number }[] = []
  const { x, y } = enemy.pos
  const currentDir = dirVec(enemy.dir)

  // Check all directions
  if (!isWall(maze, x, y - 1)) validMoves.push({ dir: 'up', dx: 0, dy: -1 })
  if (!isWall(maze, x, y + 1)) validMoves.push({ dir: 'down', dx: 0, dy: 1 })
  if (!isWall(maze, x - 1, y)) validMoves.push({ dir: 'left', dx: -1, dy: 0 })
  if (!isWall(maze, x + 1, y)) validMoves.push({ dir: 'right', dx: 1, dy: 0 })

  if (validMoves.length === 0) return null

  // Prefer non-reversing moves
  const nonReversingMoves = validMoves.filter(
    (move) => move.dx !== -currentDir.x || move.dy !== -currentDir.y
  )

  const movesToConsider =
    nonReversingMoves.length > 0 && validMoves.length > 1
      ? nonReversingMoves
      : validMoves

  // Find closest move to target
  let bestMove = movesToConsider[0]
  let minDistance = Infinity

  for (const move of movesToConsider) {
    const distance = Math.hypot(x + move.dx - target.x, y + move.dy - target.y)
    if (distance < minDistance) {
      minDistance = distance
      bestMove = move
    }
  }

  return bestMove.dir
}

const updateGhosts = (model: Model) => {
  if (!model.gameReady) return
  if (model.frameCount % 6 !== 0) return

  const maze = model.maze

  for (const g of model.ghosts) {
    const target = getEnemyTarget(g, model)
    const bestDir = getBestMove(g, target, maze)

    if (bestDir) {
      g.dir = bestDir
      const v = dirVec(bestDir)
      g.pos.x += v.x
      g.pos.y += v.y
    }
  }
}

const checkCollisions = (model: Model) => {
  const { pac, ghosts } = model

  // Don't check collisions if already game over
  if (model.lives <= 0) return

  // Check ghost collisions
  for (const enemy of ghosts) {
    if (enemy.pos.x === pac.pos.x && enemy.pos.y === pac.pos.y) {
      if (!pac.isInvulnerable) {
        model.lives--
        console.log('Hit! Lives remaining:', model.lives)

        if (model.lives <= 0) {
          // Game over
          model.gameReady = false
          console.log('GAME OVER')
        } else {
          // Reset for next life
          pac.pos = { x: 9, y: 16 }
          pac.dir = 'right'
          pac.nextDir = null
          pac.isInvulnerable = true
          model.frameCount = 0
          model.gameReady = false

          // Restart after delay
          setTimeout(() => {
            model.gameReady = true
          }, 2000)

          // Reset ghosts
          ghosts[0].pos = { x: 9, y: 8 }
          ghosts[1].pos = { x: 9, y: 10 }
          ghosts[2].pos = { x: 7, y: 10 }
          ghosts[3].pos = { x: 11, y: 10 }
        }
        break // Only process one collision per frame
      }
    }
  }
}

export const update = (
  payload: any,
  model: Model,
  _dispatch: any,
  _ctx: TVCtx
) => {
  switch (payload.type) {
    case 'INIT_PACMAN': {
      model.lastUpdate = performance.now()
      model.gameReady = false
      model.frameCount = 0
      return { model, effects: [drawPacmanIO(model)] }
    }

    case 'CALIB_UPDATE': {
      const { g } = payload.msg ?? {}

      // Update frame counter
      model.frameCount++

      // Start game after 30 frames (~500ms)
      if (!model.gameReady && model.frameCount > 30) {
        model.gameReady = true
      }

      // Remove invulnerability after 120 frames (~2 seconds)
      if (model.pac.isInvulnerable && model.frameCount > 120) {
        model.pac.isInvulnerable = false
      }

      // Don't process input if game over
      if (model.lives <= 0) {
        return { model, effects: [drawPacmanIO(model)] }
      }

      // Process accelerometer input
      let nx = 0,
        ny = 0

      if (g && Array.isArray(g) && g.length >= 2) {
        // Different amplification to balance sensitivity
        nx = Math.max(-1, Math.min(1, Number(g[0] ?? 0) * 100)) // Boost left/right more
        ny = Math.max(-1, Math.min(1, Number(g[1] ?? 0) * 150)) // Less boost for up/down
      }

      // Debug logging - show raw values
      if (model.frameCount % 30 === 0) {
        console.log('RAW TILT:', g?.[0], g?.[1], '→ normalized:', { nx, ny })
      }

      // Lower threshold for all directions
      const threshold = 0.1

      if (Math.abs(nx) > threshold || Math.abs(ny) > threshold) {
        // Now both axes should be balanced, use simple comparison
        const newDir =
          Math.abs(nx) > Math.abs(ny)
            ? nx < 0
              ? 'left'
              : 'right'
            : ny < 0
              ? 'up'
              : 'down'

        model.pac.nextDir = newDir
        if (model.frameCount % 10 === 0) {
          console.log('Direction queued:', newDir, 'from tilt:', { nx, ny })
        }
      }

      // Update game state if ready
      if (model.gameReady) {
        updatePac(model)
        updateGhosts(model)
        checkCollisions(model)
      }

      return { model, effects: [drawPacmanIO(model)] }
    }

    default:
      return { model, effects: [] }
  }
}
