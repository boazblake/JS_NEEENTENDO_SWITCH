import { IO } from 'algebraic-js'
import type { Model } from './types'

export const drawDrivingIO = (model: Model) =>
  IO(() => {
    const el = document.getElementById('driving-canvas') as HTMLCanvasElement
    if (!el) return

    const ctx = el.getContext('2d')
    if (!ctx) return

    const w = (el.width = window.innerWidth)
    const h = (el.height = window.innerHeight)

    ctx.clearRect(0, 0, w, h)

    // Road
    ctx.fillStyle = '#333'
    ctx.fillRect(w * 0.2, 0, w * 0.6, h)

    // Car
    const car = model.car
    ctx.save()
    ctx.translate(car.x, car.y)
    ctx.rotate(car.angle)

    ctx.fillStyle = 'red'
    ctx.fillRect(-20, -40, 40, 80)

    ctx.restore()
  })
