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

    const car = model.car

    // === CAMERA & PERSPECTIVE SETTINGS ===
    const horizonY = h * 0.38
    const cameraHeightBase = 2.2
    const cameraDist = 1.0
    const fov = 1.8
    const scaleFactor = 180

    // Speed affects perceived height and horizon bounce
    const speedEffect = Math.min(car.speed / 80, 1.2)
    const cameraHeight =
      cameraHeightBase +
      speedEffect * 0.8 +
      Math.sin(model.time * 0.2) * speedEffect * 0.15
    const bounceY = Math.sin(model.time * 0.25) * speedEffect * 3

    // Road follows a predefined path (simulating track curves and hills)
    const roadProgress = -car.z
    const roadX = getRoadXAt(roadProgress) * 8
    const roadCurveStrength = getRoadCurveStrengthAt(roadProgress)

    // === SKY & CLOUDS (Mario Kart style) ===
    const skyGrad = ctx.createLinearGradient(0, 0, 0, horizonY + bounceY)
    skyGrad.addColorStop(0, '#0ea5e9')
    skyGrad.addColorStop(0.6, '#7dd3fc')
    skyGrad.addColorStop(1, '#e0f2fe')
    ctx.fillStyle = skyGrad
    ctx.fillRect(0, 0, w, horizonY + bounceY + 50)

    // Simple animated clouds
    drawClouds(ctx, w, model.time)

    // === GROUND / TRACK (TRUE MODE 7 STYLE) ===
    ctx.save()
    ctx.translate(w / 2, horizonY + bounceY)

    const segments = 180
    const segmentDepth = 2.5

    for (let i = segments; i > 0; i--) {
      const z = i * segmentDepth
      const worldZ = roadProgress + z

      // Height variation (hills)
      const heightOffset = getHeightAt(worldZ) * 20

      const depth = z / 20 + cameraHeight + heightOffset
      const scale = (cameraDist * fov) / depth
      const screenY = (z / segments) * (h * 0.8)

      // Road lateral position based on track curve
      const curveNow = getRoadXAt(worldZ) * roadCurveStrength * (1 + z * 0.001)
      const curveOffset = (car.x - curveNow) * scale * scaleFactor

      const roadWidth = 12 * scale * scaleFactor

      // Track surface (green grass on sides, gray road)
      const grassColor = worldZ % 16 < 8 ? '#16a34a' : '#22c55e'
      ctx.fillStyle = grassColor
      ctx.fillRect(-w, screenY - 1, w * 2, 4)

      // Road
      ctx.fillStyle = '#4b5563'
      ctx.fillRect(-roadWidth / 2 + curveOffset, screenY, roadWidth, 4)

      // White side lines
      ctx.strokeStyle = '#fefce8'
      ctx.lineWidth = scale * 8
      ctx.beginPath()
      ctx.moveTo(-roadWidth / 2 + curveOffset, screenY)
      ctx.lineTo(-roadWidth / 2 + curveOffset + roadWidth, screenY)
      ctx.stroke()

      // Dashed center line (only on straights or mild curves)
      if (
        Math.abs(getRoadCurveStrengthAt(worldZ)) < 0.3 &&
        Math.floor(worldZ / 10) % 2 === 0
      ) {
        ctx.fillStyle = '#ffffff'
        const dashW = scale * 20
        ctx.fillRect(curveOffset - dashW / 2, screenY, dashW, scale * 6)
      }

      // Rumble strips (red/white)
      if (i % 3 === 0) {
        ctx.fillStyle = i % 6 === 0 ? '#dc2626' : '#ffffff'
        const stripW = scale * 12
        ctx.fillRect(
          -roadWidth / 2 + curveOffset - stripW,
          screenY,
          stripW,
          scale * 6
        )
        ctx.fillRect(roadWidth / 2 + curveOffset, screenY, stripW, scale * 6)
      }
    }

    ctx.restore()

    // === DRAW CAR (with motion blur & tilt) ===
    drawMarioKart(ctx, w, h, car, model.speed, model.time)

    // === HUD: Speedometer ===
    drawSpeedometer(ctx, w, h, car.speed)
  })

// Simulated track path (sine waves + hills)
const getRoadXAt = (z: number): number => {
  return Math.sin(z * 0.008) * 3 + Math.sin(z * 0.0037) * 5
}

const getRoadCurveStrengthAt = (z: number): number => {
  return Math.sin(z * 0.006) * 0.6
}

const getHeightAt = (z: number): number => {
  return Math.sin(z * 0.02) * 0.5 + Math.sin(z * 0.007) * 0.3
}

// Simple scrolling clouds
const drawClouds = (ctx: CanvasRenderingContext2D, w: number, time: number) => {
  ctx.save()
  ctx.globalAlpha = 0.7
  const cloudY = 80 + Math.sin(time * 0.1) * 10
  const offset = (time * 0.2) % w
  for (let i = -2; i < 3; i++) {
    const x = ((offset + i * 300) % (w + 600)) - 300
    ctx.fillStyle = '#ffffff'
    ctx.beginPath()
    ctx.arc(x + 50, cloudY, 40, 0, Math.PI * 2)
    ctx.arc(x + 90, cloudY, 50, 0, Math.PI * 2)
    ctx.arc(x + 130, cloudY, 40, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.restore()
}

// Mario Kart-style kart sprite (simplified)
const drawMarioKart = (
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  car: any,
  speed: number,
  time: number
) => {
  const baseY = h * 0.78
  const baseX = w / 2 + car.x * 18

  ctx.save()
  ctx.translate(baseX, baseY)

  // Tilt based on steering and lateral acceleration
  const tilt = car.steer * 0.25 + (car.x - car.prevX) * 3
  ctx.rotate(tilt * 0.8)

  // Bounce + squash/stretch based on speed
  const bounce = Math.sin(time * 0.4) * speed * 0.03
  const squash = 1 + speed * 0.003

  ctx.scale(1, squash)
  ctx.translate(0, bounce - 20)

  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.4)'
  ctx.beginPath()
  ctx.ellipse(0, 60, 70, 25, 0, 0, Math.PI * 2)
  ctx.fill()

  // Body (red like Mario's kart)
  ctx.fillStyle = '#ef4444'
  ctx.strokeStyle = '#1f2937'
  ctx.lineWidth = 6
  ctx.beginPath()
  ctx.roundRect(-50, -40, 100, 90, 20)
  ctx.fill()
  ctx.stroke()

  // Windshield
  ctx.fillStyle = '#1e293b'
  ctx.beginPath()
  ctx.roundRect(-35, -25, 70, 40, 10)
  ctx.fill()

  // Face (Mario!)
  ctx.fillStyle = '#fdbcb4'
  ctx.beginPath()
  ctx.arc(0, -15, 22, 0, Math.PI * 2)
  ctx.fill()

  // Hat
  ctx.fillStyle = '#dc2626'
  ctx.beginPath()
  ctx.arc(0, -28, 26, 0, Math.PI)
  ctx.fill()

  // Wheels
  const wheelOffsets = [-40, 40]
  wheelOffsets.forEach((ox) => {
    ctx.fillStyle = '#1f2937'
    ctx.beginPath()
    ctx.arc(ox, 30, 20, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#94a3b8'
    ctx.beginPath()
    ctx.arc(ox, 30, 12, 0, Math.PI * 2)
    ctx.fill()
  })

  ctx.restore()
}

// Simple speedometer
const drawSpeedometer = (
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  speed: number
) => {
  const maxSpeed = 120
  const norm = Math.min(speed / maxSpeed, 1)
  const angle = norm * Math.PI * 0.8 - Math.PI * 0.4

  ctx.save()
  ctx.translate(w - 180, h - 120)
  ctx.strokeStyle = '#1f2937'
  ctx.lineWidth = 20
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.arc(0, 0, 80, Math.PI * 0.6, Math.PI * 0.4, false)
  ctx.stroke()

  ctx.strokeStyle = speed > 90 ? '#ef4444' : '#10b981'
  ctx.lineWidth = 16
  ctx.beginPath()
  ctx.arc(0, 0, 80, Math.PI * 0.6, Math.PI * 0.6 + angle, false)
  ctx.stroke()

  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 36px monospace'
  ctx.textAlign = 'center'
  ctx.fillText(`${Math.floor(speed)}`, 0, 20)

  ctx.font = '16px monospace'
  ctx.fillText('km/h', 0, 40)
  ctx.restore()
}
