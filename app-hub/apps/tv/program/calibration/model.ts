// calibration/model.ts
// All math unchanged, only effect system rewritten correctly.

import type { Effect } from 'algebraic-fx'
import type { DomEnv } from 'algebraic-fx'

/* ============================================================================
 *  Quaternion Projection Math (unchanged)
 * ==========================================================================*/

/**
 * Internal helper to apply rotation and perspective projection to a set of 3D points.
 */
const _getProjectedPolygon = (
  quaternion: [number, number, number, number],
  width: number,
  height: number,
  pts3D: [number, number, number][]
): [number, number][] => {
  const fov = 400

  const [inX, inY, inZ, inW] = quaternion
  const mag = Math.hypot(inX, inY, inZ, inW)

  let x = 0,
    y = 0,
    z = 0,
    w = 1

  if (mag > 0.0001) {
    x = inX / mag
    y = inY / mag
    z = inZ / mag
    w = inW / mag
  }

  const xx = x * x,
    yy = y * y,
    zz = z * z

  const m = [
    [1 - 2 * (yy + zz), 2 * (x * y - z * w), 2 * (x * z + y * w)],
    [2 * (x * y + z * w), 1 - 2 * (xx + zz), 2 * (y * z - x * w)],
    [2 * (x * z - y * w), 2 * (y * z + x * w), 1 - 2 * (xx + yy)]
  ]

  const rotate = (p: [number, number, number]): [number, number, number] => [
    m[0][0] * p[0] + m[0][1] * p[1] + m[0][2] * p[2],
    m[1][0] * p[0] + m[1][1] * p[1] + m[1][2] * p[2],
    m[2][0] * p[0] + m[2][1] * p[1] + m[2][2] * p[2]
  ]

  const project = ([px, py, pz]: [number, number, number]): [
    number,
    number
  ] => {
    const scale = fov / (fov - pz)
    return [-px * scale + width / 2, py * scale + height / 2]
  }

  return pts3D.map((p) => project(rotate(p)))
}

/**
 * Calculates the projected 2D coordinates for the device body and returns
 * the body polygon along with the status message.
 */
const quatToScreen = (
  quaternion: [number, number, number, number],
  width: number,
  height: number
): [[number, number][], string] => {
  const [inX, inY, inZ, inW] = quaternion
  const mag = Math.hypot(inX, inY, inZ, inW)

  let statusMessage = 'Q: Identity (Waiting for data)'
  if (mag > 0.0001) statusMessage = 'Q: Active'

  const bodyPts3D: [number, number, number][] = [
    [-150, -300, -50],
    [150, -300, -50],
    [150, 300, -50],
    [-150, 300, -50]
  ]

  const poly = _getProjectedPolygon(quaternion, width, height, bodyPts3D)
  return [poly, statusMessage]
}

// roll utility
const getRoll = (gravity: number[]) => {
  const [gx, gy] = gravity
  return Math.atan2(gx, -gy)
}

/* ============================================================================
 *  DRAWING EFFECT (the ONLY part we rewrite)
 *
 *  MUST return a RawEffect<DomEnv> → which means: Effect<DomEnv, any>
 *  i.e. an object with a .run(env, dispatch) method.
 * ==========================================================================*/

export const makeDrawEffect = (
  quaternion: number[],
  gravity: number[],
  rotation: number[]
): Effect<DomEnv, any> => ({
  run(env) {
    const doc = env.document
    const win = env.window

    console.log('draw', quaternion)
    const canvas = doc.getElementById(
      'calibrationCanvas'
    ) as HTMLCanvasElement | null
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const { width, height } = canvas

    console.log(
      'Draw called with Q:',
      quaternion,
      'G:',
      gravity,
      'R:',
      rotation
    )

    // --- Outer body polygon + status ---
    const [poly, statusMessage] = quatToScreen(
      quaternion as [number, number, number, number],
      width,
      height
    )

    // Inner screen polygon
    const screenPts3D: [number, number, number][] = [
      [-130, -270, -49],
      [130, -270, -49],
      [130, 270, -49],
      [-130, 270, -49]
    ]
    const screenPoly = _getProjectedPolygon(
      quaternion as [number, number, number, number],
      width,
      height,
      screenPts3D
    )

    // Notch polygon
    const notchPts3D: [number, number, number][] = [
      [-30, -290, -48],
      [30, -290, -48],
      [30, -260, -48],
      [-30, -260, -48]
    ]
    const notchPoly = _getProjectedPolygon(
      quaternion as [number, number, number, number],
      width,
      height,
      notchPts3D
    )

    // Forward dot projected
    const forwardDot3D: [number, number, number][] = [[0, 0, -30]]
    const [[dotX, dotY]] = _getProjectedPolygon(
      quaternion as [number, number, number, number],
      width,
      height,
      forwardDot3D
    )

    // rotation intensity
    const [alpha, beta, gamma] = rotation
    const magnitude = Math.hypot(alpha, beta, gamma)
    const maxSpeed = 5.0
    const intensity = Math.min(1.0, magnitude / maxSpeed)

    ctx.clearRect(0, 0, width, height)

    // Center reticle
    const cx = width / 2
    const cy = height / 2
    ctx.strokeStyle = 'rgba(255,255,255,0.4)'
    ctx.beginPath()
    ctx.arc(cx, cy, 50, 0, Math.PI * 2)
    ctx.stroke()

    // OUTER BODY
    ctx.beginPath()
    ctx.moveTo(poly[0][0], poly[0][1])
    for (let i = 1; i < poly.length; i++) ctx.lineTo(poly[i][0], poly[i][1])
    ctx.closePath()
    ctx.fillStyle = '#20c997'
    ctx.fill()

    // dynamic stroke
    const strokeR = Math.floor(20 + 235 * intensity)
    const strokeG = Math.floor(184 - 100 * intensity)
    const strokeB = Math.floor(166 - 100 * intensity)
    ctx.strokeStyle = `rgb(${strokeR}, ${strokeG}, ${strokeB})`
    ctx.lineWidth = 2 + intensity * 4
    ctx.stroke()

    // INNER SCREEN
    ctx.beginPath()
    ctx.moveTo(screenPoly[0][0], screenPoly[0][1])
    for (let i = 1; i < screenPoly.length; i++)
      ctx.lineTo(screenPoly[i][0], screenPoly[i][1])
    ctx.closePath()
    ctx.fillStyle = '#111827'
    ctx.fill()

    // NOTCH
    ctx.beginPath()
    ctx.moveTo(notchPoly[0][0], notchPoly[0][1])
    for (let i = 1; i < notchPoly.length; i++)
      ctx.lineTo(notchPoly[i][0], notchPoly[i][1])
    ctx.closePath()
    ctx.fillStyle = '#48bb78'
    ctx.fill()

    // FORWARD DOT
    ctx.beginPath()
    ctx.arc(dotX, dotY, 10, 0, Math.PI * 2)
    ctx.closePath()
    ctx.fillStyle = 'white'
    ctx.fill()

    // Debug text
    ctx.fillStyle = 'rgba(255,255,255,0.9)'
    ctx.font = '16px system-ui, sans-serif'

    ctx.fillText(`Q: ${quaternion.map((v) => v.toFixed(2)).join(',')}`, 12, 24)
    ctx.fillText(`|ω|: ${magnitude.toFixed(2)} rad/s`, 12, 44)
    ctx.fillText(`Status: ${statusMessage}`, 12, 64)
  }
})
