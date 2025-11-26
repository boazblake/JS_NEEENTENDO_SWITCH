import { div, canvas } from '@shared/renderer'
import { IO } from 'algebraic-js'

/**
 * Draw the spray dots to the canvas each frame.
 */
export const drawSprayIO = (model) =>
  IO(() => {
    const el = document.getElementById(
      'spray-canvas'
    ) as HTMLCanvasElement | null
    if (!el) return
    const ctx = el.getContext('2d')
    if (!ctx) return

    const w = (el.width = window.innerWidth)
    const h = (el.height = window.innerHeight)
    ctx.clearRect(0, 0, w, h)

    for (const d of model.spray.dots) {
      const grd = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, d.size)
      grd.addColorStop(0, d.color)
      grd.addColorStop(1, 'transparent')
      ctx.globalAlpha = d.opacity
      ctx.fillStyle = grd
      ctx.beginPath()
      ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.globalAlpha = 1
  })

/**
 * Canvas view node.
 * The IO draw effect should be run by the parent after render.
 */
export const view = (model) =>
  div(
    {
      className:
        'fixed inset-0 bg-slate-900 pointer-events-none overflow-hidden'
    },
    [
      canvas({
        id: 'spray-canvas',
        width: window.innerWidth,
        height: window.innerHeight,
        className: 'w-full h-full block'
      })
    ]
  )
