// tv/pac-man/draw.ts
import { IO } from 'algebraic-js'
import type { Model, Direction } from './types'
import { isWall } from './maze'

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

export const drawPacmanIO = (model: Model) =>
  IO(() => {
    const el = document.getElementById('pacman-canvas') as HTMLCanvasElement
    if (!el) {
      console.error('Canvas not found!')
      return
    }

    const ctx = el.getContext('2d')
    if (!ctx) {
      console.error('Cannot get canvas context!')
      return
    }

    const w = (el.width = window.innerWidth)
    const h = (el.height = window.innerHeight)

    ctx.clearRect(0, 0, w, h)

    const maze = model.maze
    if (!maze || !maze.rows || !maze.cols) {
      console.error('Invalid maze data!')
      return
    }

    const size = Math.floor(Math.min(w / maze.cols, h / maze.rows))

    // Draw maze walls
    ctx.fillStyle = '#00ADEF'
    for (let y = 0; y < maze.rows; y++) {
      for (let x = 0; x < maze.cols; x++) {
        if (isWall(maze, x, y)) {
          ctx.fillRect(x * size, y * size, size, size)
        }
      }
    }

    // Draw ghosts first (so they're behind Pac-Man)
    if (model.ghosts && Array.isArray(model.ghosts)) {
      for (const g of model.ghosts) {
        if (!g || !g.pos) continue

        ctx.fillStyle = g.color

        // Ghost body (rounded top)
        ctx.beginPath()
        ctx.arc(
          g.pos.x * size + size / 2,
          g.pos.y * size + size / 3,
          size * 0.4,
          Math.PI,
          0,
          false
        )
        ctx.lineTo(g.pos.x * size + size * 0.9, g.pos.y * size + size)
        ctx.lineTo(g.pos.x * size + size * 0.75, g.pos.y * size + size * 0.8)
        ctx.lineTo(g.pos.x * size + size * 0.6, g.pos.y * size + size)
        ctx.lineTo(g.pos.x * size + size * 0.5, g.pos.y * size + size * 0.8)
        ctx.lineTo(g.pos.x * size + size * 0.4, g.pos.y * size + size)
        ctx.lineTo(g.pos.x * size + size * 0.25, g.pos.y * size + size * 0.8)
        ctx.lineTo(g.pos.x * size + size * 0.1, g.pos.y * size + size)
        ctx.closePath()
        ctx.fill()

        // Ghost eyes
        ctx.fillStyle = '#fff'
        ctx.beginPath()
        ctx.arc(
          g.pos.x * size + size * 0.35,
          g.pos.y * size + size * 0.4,
          size * 0.1,
          0,
          Math.PI * 2
        )
        ctx.fill()
        ctx.beginPath()
        ctx.arc(
          g.pos.x * size + size * 0.65,
          g.pos.y * size + size * 0.4,
          size * 0.1,
          0,
          Math.PI * 2
        )
        ctx.fill()

        // Ghost pupils
        ctx.fillStyle = '#000'
        ctx.beginPath()
        ctx.arc(
          g.pos.x * size + size * 0.35,
          g.pos.y * size + size * 0.4,
          size * 0.05,
          0,
          Math.PI * 2
        )
        ctx.fill()
        ctx.beginPath()
        ctx.arc(
          g.pos.x * size + size * 0.65,
          g.pos.y * size + size * 0.4,
          size * 0.05,
          0,
          Math.PI * 2
        )
        ctx.fill()
      }
    }

    // Draw Pac-Man
    if (model.pac && model.pac.pos) {
      const pac = model.pac

      // Flash when invulnerable
      if (pac.isInvulnerable && model.frameCount % 10 < 5) {
        // Skip drawing (flashing effect)
      } else {
        ctx.fillStyle = '#FFFF00'

        // Pac-Man mouth animation
        const mouthAngle =
          (Math.sin(model.frameCount * 0.2) * 0.2 + 0.2) * Math.PI

        let startAngle = 0
        let endAngle = Math.PI * 2

        // Orient mouth based on direction
        switch (pac.dir) {
          case 'right':
            startAngle = mouthAngle / 2
            endAngle = Math.PI * 2 - mouthAngle / 2
            break
          case 'left':
            startAngle = Math.PI + mouthAngle / 2
            endAngle = Math.PI - mouthAngle / 2
            break
          case 'up':
            startAngle = Math.PI * 1.5 + mouthAngle / 2
            endAngle = Math.PI * 1.5 - mouthAngle / 2
            break
          case 'down':
            startAngle = Math.PI * 0.5 + mouthAngle / 2
            endAngle = Math.PI * 0.5 - mouthAngle / 2
            break
        }

        ctx.beginPath()
        ctx.arc(
          pac.pos.x * size + size / 2,
          pac.pos.y * size + size / 2,
          size * 0.45,
          startAngle,
          endAngle
        )
        ctx.lineTo(pac.pos.x * size + size / 2, pac.pos.y * size + size / 2)
        ctx.closePath()
        ctx.fill()
      }
    }

    // Draw UI
    ctx.fillStyle = '#fff'
    ctx.font = 'bold 16px monospace'
    ctx.fillText(`Score: ${model.score || 0}`, 10, 25)
    ctx.fillText(`Lives: ${'❤️'.repeat(model.lives || 0)}`, 10, 50)

    if (!model.gameReady) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
      ctx.fillRect(0, 0, w, h)
      ctx.fillStyle = '#FFFF00'
      ctx.font = 'bold 32px monospace'
      ctx.textAlign = 'center'

      if (model.lives === 0) {
        ctx.fillText('GAME OVER', w / 2, h / 2)
        ctx.font = 'bold 20px monospace'
        ctx.fillText(`Final Score: ${model.score}`, w / 2, h / 2 + 40)
      } else {
        ctx.fillText('GET READY!', w / 2, h / 2)
      }
      ctx.textAlign = 'left'
    }

    // Debug info (optional - remove in production)
    if (model.pac && model.pac.pos) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
      ctx.font = '10px monospace'
      ctx.fillText(
        `Pac: (${model.pac.pos.x}, ${model.pac.pos.y}) ${model.pac.dir}`,
        10,
        h - 10
      )
    }
  })
