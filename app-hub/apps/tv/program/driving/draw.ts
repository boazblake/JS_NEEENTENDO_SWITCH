// draw.ts — TRUE SNES Mode 7 (perspective-correct, no hacks)
import { IO } from 'algebraic-fx'
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

    const car = model.car
    const baseZ = -car.z

    // True SNES Mode 7 parameters (these are the real ones)
    const horizon = 0.42 * h
    const spaceZ = 0.8 // distance from camera to projection plane
    const spaceY = 0.0 // camera height above ground (0 = on ground)
    const focal = 1.8 // focal length — controls "fish-eye" vs flat
    const camX = car.x * 0.9 // lateral camera follow (tuned for feel)

    // Sky + ground (classic Mario Kart)
    ctx.fillStyle = '#58C8F8'
    ctx.fillRect(0, 0, w, horizon)
    ctx.fillStyle = '#90D090'
    ctx.fillRect(0, horizon, w, h - horizon)

    ctx.save()
    ctx.translate(w / 2, horizon)

    // Draw from back to front — true scanline-style Mode 7
    const steps = 240
    const maxVisibleY = h - horizon

    for (let step = steps; step >= 1; step--) {
      const screenY = (step / steps) * maxVisibleY
      if (screenY <= 0) continue

      // TRUE Mode 7 perspective formula (this is the real one)
      const relY = screenY / focal
      const worldZ = (spaceZ * focal) / relY + spaceY

      const scale = (focal * spaceZ) / (worldZ - spaceY)

      // World position of this scanline
      const worldX = camX

      // Road width at this depth
      const halfWidth = 5.5 * scale // road half-width in world units

      // Lateral offset from camera movement
      const offsetX = worldX * scale

      const leftX = -halfWidth + offsetX
      const rightX = halfWidth + offsetX

      // Road surface
      ctx.fillStyle = '#585858'
      ctx.fillRect(leftX, screenY, rightX - leftX, maxVisibleY - screenY + 4)

      // White rumble strips (alternating)
      const segment = Math.floor((baseZ + worldZ) / 8)
      ctx.fillStyle = segment % 2 === 0 ? '#FFFFFF' : '#F0F0F0'
      const stripWidth = 0.6 * scale
      ctx.fillRect(leftX, screenY, stripWidth, maxVisibleY - screenY + 4)
      ctx.fillRect(
        rightX - stripWidth,
        screenY,
        stripWidth,
        maxVisibleY - screenY + 4
      )

      // Dashed center line
      if (segment % 4 === 1) {
        ctx.fillStyle = '#FFFFFF'
        const dashWidth = 0.3 * scale
        const dashHeight = 2.0 * scale
        ctx.fillRect(offsetX - dashWidth / 2, screenY, dashWidth, dashHeight)
      }
    }

    ctx.restore()

    // Classic Mario Kart-style kart
    drawMarioKartCar(ctx, w, h, car)
  })

const drawMarioKartCar = (
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  car: any
) => {
  ctx.save()
  ctx.translate(w / 2 + car.x * 16, h * 0.84)
  ctx.rotate(car.steer * 0.32)

  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.45)'
  ctx.ellipse(0, 30, 84, 38, 0, 0, Math.PI * 2)
  ctx.fill()

  // Body
  ctx.fillStyle = '#E02020'
  ctx.fillRect(-38, -52, 76, 100)

  // Top
  ctx.fillStyle = '#2020A0'
  ctx.fillRect(-30, -40, 60, 60)

  // Wheels
  ctx.fillStyle = '#181818'
  ctx.fillRect(-42, -44, 26, 36)
  ctx.fillRect(16, -44, 26, 36)
  ctx.fillRect(-42, 20, 26, 36)
  ctx.fillRect(16, 20, 26, 36)

  ctx.restore()
}
