import type { Model } from './types'
import type { TVCtx } from '../types'
import { drawDrivingIO } from './draw'

export const update = (msg: any, model: Model, _dispatch: any, ctx: TVCtx) => {
  switch (msg.type) {
    case 'CALIB_UPDATE': {
      const { id } = msg.msg

      const controller = ctx.controllers[id]
      if (!controller) return { model, effects: [] }

      const pointer = controller.pointer
      if (!pointer) return { model, effects: [] }

      const w = ctx.screenW || window.innerWidth
      const h = ctx.screenH || window.innerHeight
      const cx = w / 2
      const cy = h / 2

      // pointer → normalized inputs
      const nx = (pointer.x - cx) / (w * 0.5) // left/right
      const ny = (cy - pointer.y) / (h * 0.5) // forward/back

      const steer = Math.max(-1, Math.min(1, nx))
      const throttle = Math.max(0, ny)
      const brake = Math.max(0, -ny)

      const dt = 1 / 60
      const car = { ...model.car }

      car.angle += steer * 2.5 * dt
      car.vel += throttle * 300 * dt
      car.vel -= brake * 400 * dt
      car.vel *= 0.98

      if (car.vel > 900) car.vel = 900
      if (car.vel < -300) car.vel = -300

      car.x += Math.sin(car.angle) * car.vel * dt
      car.y -= Math.cos(car.angle) * car.vel * dt

      const next: Model = { car }

      return { model: next, effects: [drawDrivingIO(next)] }
    }

    default:
      return { model, effects: [] }
  }
}
