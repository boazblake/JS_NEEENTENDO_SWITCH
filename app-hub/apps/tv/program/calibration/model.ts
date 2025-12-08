import { Reader, IO, askDocument, type DomEnv } from 'algebraic-fx'

/**
 * Internal helper to apply rotation and perspective projection to a set of 3D points.
 * @param quaternion The device orientation quaternion.
 * @param width Canvas width.
 * @param height Canvas height.
 * @param pts3D The 3D points of the object to project.
 * @returns An array of 2D projected points [x, y].
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
    w = 1 // Default to identity quaternion (no rotation)

  if (mag > 0.0001) {
    // Normalize input quaternion
    x = inX / mag
    y = inY / mag
    z = inZ / mag
    w = inW / mag
  }

  const xx = x * x,
    yy = y * y,
    zz = z * z

  // Rotation Matrix M
  const m = [
    [1 - 2 * (yy + zz), 2 * (x * y - z * w), 2 * (x * z + y * w)],
    [2 * (x * y + z * w), 1 - 2 * (xx + zz), 2 * (y * z - x * w)],
    [2 * (x * z - y * w), 2 * (y * z + x * w), 1 - 2 * (xx + yy)]
  ]

  // Apply Rotation: p' = M * p
  const rotate = (p: [number, number, number]): [number, number, number] => [
    m[0][0] * p[0] + m[0][1] * p[1] + m[0][2] * p[2],
    m[1][0] * p[0] + m[1][1] * p[1] + m[1][2] * p[2],
    m[2][0] * p[0] + m[2][1] * p[1] + m[2][2] * p[2]
  ]

  // Apply Perspective Projection
  const project = ([pX, pY, pZ]: [number, number, number]): [
    number,
    number
  ] => {
    const scale = fov / (fov - pZ)
    return [-pX * scale + width / 2, pY * scale + height / 2]
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
): [number, number, string] => {
  const [inX, inY, inZ, inW] = quaternion
  const mag = Math.hypot(inX, inY, inZ, inW)

  let statusMessage = 'Q: Identity (Waiting for data)'
  if (mag > 0.0001) {
    statusMessage = 'Q: Active'
  }

  // Points defining the large outer body of the phone (Width 300, Height 600, Depth -50)
  const bodyPts3D: [number, number, number][] = [
    [-150, -300, -50],
    [150, -300, -50],
    [150, 300, -50],
    [-150, 300, -50]
  ]

  const poly = _getProjectedPolygon(quaternion, width, height, bodyPts3D)

  // Return the calculated polygon points and the status message
  return [poly, statusMessage]
}

// --- Utility functions (Unchanged) ---
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

// ----------------------------------------------------------------------
// DRAWING FUNCTION (Updated to draw inner screen and features)
// ----------------------------------------------------------------------
export const drawControllerReaderIO = (
  quaternion: number[],
  gravity: number[],
  rotation: number[] // Added rotation rate (angular velocity)
) =>
  askDocument.map((doc) =>
    IO(() => {
      // --- DEBUGGING: Confirm execution and data ---
      console.log('Draw called with Q:', quaternion, 'R:', rotation)

      const canvas = doc.getElementById(
        'calibrationCanvas'
      ) as HTMLCanvasElement
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const { width, height } = canvas

      // Get the outer body polygon and status
      const [poly, statusMessage] = quatToScreen(quaternion, width, height) as [
        [number, number][],
        string
      ]

      // --- Calculate the inner screen polygon points ---
      // Inner points (Width 260, Height 540). It must be slightly closer in Z to look right.
      const screenPts3D: [number, number, number][] = [
        [-130, -270, -49], // Z=-49 is slightly forward of Z=-50
        [130, -270, -49],
        [130, 270, -49],
        [-130, 270, -49]
      ]
      const screenPoly = _getProjectedPolygon(
        quaternion,
        width,
        height,
        screenPts3D
      )

      // --- NEW: Top Camera/Notch Indicator points (small square near the top edge) ---
      const notchPts3D: [number, number, number][] = [
        [-30, -290, -48], // Wider area, slightly closer to the viewer
        [30, -290, -48],
        [30, -260, -48],
        [-30, -260, -48]
      ]
      const notchPoly = _getProjectedPolygon(
        quaternion,
        width,
        height,
        notchPts3D
      )

      // --- NEW: Forward Vector Dot Point (Center of the screen, slightly in front) ---
      // We only need one point for the center dot
      const forwardDot3D: [number, number, number][] = [
        [0, 0, -30] // X=0, Y=0, Z=-30 (Z is closer to the viewer than the screen at -49)
      ]
      const forwardDotPoly = _getProjectedPolygon(
        quaternion,
        width,
        height,
        forwardDot3D
      )
      const [dotX, dotY] = forwardDotPoly[0]

      // Destructure and calculate angular speed magnitude
      const [alpha, beta, gamma] = rotation
      const rotationMagnitude = Math.hypot(alpha, beta, gamma)

      // Normalize intensity (0 to 1) for visualization, 5 rad/s is considered fast.
      const maxSpeed = 5.0
      const intensity = Math.min(1.0, rotationMagnitude / maxSpeed)

      ctx.clearRect(0, 0, width, height)

      // --- center reticle ---
      const cx = width / 2
      const cy = height / 2
      ctx.strokeStyle = 'rgba(255,255,255,0.4)'
      ctx.beginPath()
      ctx.arc(cx, cy, 50, 0, Math.PI * 2)
      ctx.stroke()

      // 1. Draw OUTER 2.5D phone body (Bezel)
      ctx.beginPath()
      ctx.moveTo(poly[0][0], poly[0][1])
      for (let i = 1; i < poly.length; i++) ctx.lineTo(poly[i][0], poly[i][1])
      ctx.closePath()

      // Base fill color (Teal body/bezel)
      ctx.fillStyle = '#20c997'
      ctx.fill()

      // Dynamic Stroke: Color shifts and thickens with rotation speed
      const strokeR = Math.floor(20 + 235 * intensity)
      const strokeG = Math.floor(184 - 100 * intensity)
      const strokeB = Math.floor(166 - 100 * intensity)

      ctx.strokeStyle = `rgb(${strokeR}, ${strokeG}, ${strokeB})`
      ctx.lineWidth = 2 + intensity * 4
      ctx.stroke()

      // 2. Draw INNER 2.5D phone screen
      ctx.beginPath()
      ctx.moveTo(screenPoly[0][0], screenPoly[0][1])
      for (let i = 1; i < screenPoly.length; i++)
        ctx.lineTo(screenPoly[i][0], screenPoly[i][1])
      ctx.closePath()

      // Dark screen fill
      ctx.fillStyle = '#111827' // Dark Slate Gray/Black
      ctx.fill()

      // 3. Draw TOP INDICATOR (Notch/Camera)
      ctx.beginPath()
      ctx.moveTo(notchPoly[0][0], notchPoly[0][1])
      for (let i = 1; i < notchPoly.length; i++)
        ctx.lineTo(notchPoly[i][0], notchPoly[i][1])
      ctx.closePath()
      ctx.fillStyle = '#48bb78' // Bright green for visibility
      ctx.fill()

      // 4. Draw FORWARD VECTOR DOT
      ctx.beginPath()
      // Arc drawn at the projected point of the forward dot
      ctx.arc(dotX, dotY, 10, 0, Math.PI * 2)
      ctx.closePath()
      ctx.fillStyle = 'white'
      ctx.fill()

      // --- Debug Text ---
      ctx.fillStyle = 'rgba(255,255,255,0.9)'
      ctx.font = '16px system-ui, sans-serif'

      // Display Quaternion data
      ctx.fillText(
        `Q: ${quaternion.map((v) => v.toFixed(2)).join(',')}`,
        12,
        24
      )

      // Display Rotation Rate Magnitude
      ctx.fillText(
        `|ω|: ${rotationMagnitude.toFixed(2)} rad/s (Intensity: ${intensity.toFixed(2)})`,
        12,
        44
      )

      // Display Status
      ctx.fillText(`Status: ${statusMessage}`, 12, 64)
    })
  )
