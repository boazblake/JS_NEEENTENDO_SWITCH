// tv/word-pond/draw.ts
import { IO } from 'algebraic-js'
import type { Model } from './types'

export const drawWordPondIO = (state: Model) =>
  IO(() => {
    const canvas = document.getElementById(
      'wordpond-canvas'
    ) as HTMLCanvasElement | null
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const w = (canvas.width = window.innerWidth)
    const h = (canvas.height = window.innerHeight)

    ctx.clearRect(0, 0, w, h)

    const pondH = 80

    // pond strip
    ctx.fillStyle = '#0f172a'
    ctx.fillRect(0, h - pondH, w, pondH)

    // letters
    ctx.font = '24px system-ui'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    for (const l of state.letters) {
      ctx.fillStyle = l.caughtBy ? '#f97316' : '#e5e7eb'
      ctx.fillText(l.char, l.x, l.y)
    }

    // nets
    ctx.strokeStyle = '#22c55e'
    ctx.lineWidth = 2
    for (const id in state.nets) {
      const net = state.nets[id]
      ctx.beginPath()
      ctx.arc(net.x, net.y, 40, 0, Math.PI * 2)
      ctx.stroke()
    }

    // ponds
    ctx.fillStyle = '#e5e7eb'
    let idx = 0
    for (const pid of state.players) {
      const pond = state.ponds[pid]
      const letters = pond?.letters.join('') || ''
      ctx.fillText(letters, 100 + idx * 200, h - pondH / 2)
      idx++
    }
  })
