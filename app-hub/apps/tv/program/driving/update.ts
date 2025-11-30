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

      const nx = (pointer.x - cx) / (w * 0.5)
      const ny = (pointer.y - cy) / (h * 0.5)

      const steerInput = Math.max(-1, Math.min(1, nx))
      const throttle = Math.max(0, ny) // forward tilt (down) = positive ny = throttle
      const brake = Math.max(0, -ny) // backward tilt (up) = negative ny = brake

      const dt = 1 / 60

      const car = { ...model.car }

      // forward velocity
      car.vel += throttle * 400 * dt
      car.vel -= brake * 500 * dt
      car.vel *= 0.985

      const maxFwd = 1200
      const maxRev = 0
      if (car.vel > maxFwd) car.vel = maxFwd
      if (car.vel < maxRev) car.vel = maxRev

      // update world position
      car.z += car.vel * dt

      // lateral movement from steer
      const lateralSpeed = 400
      car.x += steerInput * lateralSpeed * dt

      // clamp lateral position
      const roadHalfWidthWorld = 6 // world units each side
      if (car.x < -roadHalfWidthWorld) car.x = -roadHalfWidthWorld
      if (car.x > roadHalfWidthWorld) car.x = roadHalfWidthWorld

      car.steer = steerInput

      const next: Model = { car }

      return { model: next, effects: [drawDrivingIO(next)] }
    }

    default:
      return { model, effects: [] }
  }
}
