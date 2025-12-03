import { Reader, IO, askDocument, type DomEnv } from 'algebraic-fx'
/** Convert quaternion -> 2.5D Pixi projection points */
const quatToScreen = (
  quaternion: [number, number, number, number],
  width: number,
  height: number
): [number, number][] => {
  const fov = 400
  const [x, y, z, w] = quaternion
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

  const project = ([x, y, z]: [number, number, number]): [number, number] => {
    const scale = fov / (fov - z)
    return [-x * scale + width / 2, y * scale + height / 2]
  }

  const pts3D: [number, number, number][] = [
    [-50, -100, -5],
    [50, -100, -5],
    [50, 100, -5],
    [-50, 100, -5]
  ]

  return pts3D.map((p) => project(rotate(p)))
}

/** stable quaternion → forward vector → [0,1] projection */
const projectFromQuaternion = ([x, y, z, w]: [
  number,
  number,
  number,
  number
]) => {
  // normalize quaternion
  const m = Math.hypot(x, y, z, w) || 1
  x /= m
  y /= m
  z /= m
  w /= m

  // forward vector (-Z axis transformed)
  const fx = 2 * (x * z + w * y)
  const fy = 2 * (y * z - w * x)
  const fz = 1 - 2 * (x * x + y * y)

  // normalize to [0,1]
  const nx = (fx + 1) / 2
  const ny = 1 - (fy + 1) / 2
  return [nx, ny, fz]
}

/** use gravity + forward to compute roll-like rotation */
const getRoll = (gravity: number[]) => {
  const [gx, gy] = gravity
  return Math.atan2(gx, -gy)
}

export const drawControllerReaderIO = (
  quaternion: number[],
  gravity: number[]
) =>
  askDocument.map((doc) =>
    IO(() => {
      const canvas = doc.getElementById(
        'calibrationCanvas'
      ) as HTMLCanvasElement
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const { width, height } = canvas
      const poly = quatToScreen(quaternion, width, height)

      ctx.clearRect(0, 0, width, height)

      // --- center reticle ---
      const cx = width / 2
      const cy = height / 2
      ctx.strokeStyle = 'rgba(255,255,255,0.25)'
      ctx.beginPath()
      ctx.arc(cx, cy, 30, 0, Math.PI * 2)
      ctx.stroke()

      // --- 2.5D phone polygon ---
      ctx.beginPath()
      ctx.moveTo(poly[0][0], poly[0][1])
      for (let i = 1; i < poly.length; i++) ctx.lineTo(poly[i][0], poly[i][1])
      ctx.closePath()
      ctx.fillStyle = '#14b8a6'
      ctx.fill()
      ctx.strokeStyle = 'rgba(20,184,166,0.8)'
      ctx.lineWidth = 2
      ctx.stroke()

      ctx.fillStyle = 'rgba(255,255,255,0.6)'
      ctx.font = '14px system-ui, sans-serif'
      ctx.fillText(
        `qx:${quaternion.map((v) => v.toFixed(2)).join(',')}`,
        12,
        24
      )
    })
  )
