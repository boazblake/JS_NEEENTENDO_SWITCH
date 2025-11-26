// shared/orientation.ts
// Quaternion-based pointer mapping using device's forward direction.
// User calibrates by pointing phone at screen center, then tilts naturally.

type OrientationOpts = {
  invertX?: boolean
  invertY?: boolean
  sensitivity?: number // degrees of tilt for full screen traverse
  dead?: number // deadzone in degrees
}

// Calibration stores the "neutral" orientation (pointing at center)
let neutralQ = { x: 0, y: 0, z: 0, w: 1 }

export const setCalibration = (qRaw: number[] | undefined) => {
  if (!qRaw || qRaw.length < 4) return
  neutralQ = { x: qRaw[0], y: qRaw[1], z: qRaw[2], w: qRaw[3] }
}

// Multiply quaternions: q1 * q2
const qMul = (q1: any, q2: any) => ({
  w: q1.w * q2.w - q1.x * q2.x - q1.y * q2.y - q1.z * q2.z,
  x: q1.w * q2.x + q1.x * q2.w + q1.y * q2.z - q1.z * q2.y,
  y: q1.w * q2.y - q1.x * q2.z + q1.y * q2.w + q1.z * q2.x,
  z: q1.w * q2.z + q1.x * q2.y - q1.y * q2.x + q1.z * q2.w
})

// Quaternion conjugate (inverse for unit quaternions)
const qConj = (q: any) => ({ w: q.w, x: -q.x, y: -q.y, z: -q.z })

// Rotate vector by quaternion
const qRotate = (q: any, v: any) => {
  const qv = { w: 0, x: v.x, y: v.y, z: v.z }
  const result = qMul(qMul(q, qv), qConj(q))
  return { x: result.x, y: result.y, z: result.z }
}

export const orientationToXY = (
  qRaw: number[] | undefined,
  _gRaw: number[] | undefined, // not used anymore
  w: number,
  h: number,
  opts?: OrientationOpts
): [number, number] => {
  if (!qRaw || qRaw.length < 4) return [w / 2, h / 2]

  const currentQ = { x: qRaw[0], y: qRaw[1], z: qRaw[2], w: qRaw[3] }

  // Get relative orientation: neutralQ^-1 * currentQ
  const relativeQ = qMul(qConj(neutralQ), currentQ)

  // Device's forward direction in its local space (assuming portrait, phone pointing forward)
  // Adjust this vector based on your coordinate system:
  // - If phone screen faces +Z when flat: forward = {x:0, y:0, z:-1}
  // - If phone screen faces -Z when flat: forward = {x:0, y:0, z:1}
  const forward = { x: 0, y: 0, z: -1 }

  // Rotate forward vector by relative orientation
  const pointing = qRotate(relativeQ, forward)

  // Project onto screen plane (ignore Z depth, use X and Y)
  // pointing.x = tilt left/right, pointing.y = tilt up/down

  const sensitivity = opts?.sensitivity ?? 30 // degrees for full screen width/height
  const dead = opts?.dead ?? 1 // degrees
  const invX = opts?.invertX ?? false
  const invY = opts?.invertY ?? false

  // Convert pointing direction to angles (in degrees)
  const angleX = Math.atan2(pointing.x, -pointing.z) * (180 / Math.PI)
  const angleY = Math.atan2(pointing.y, -pointing.z) * (180 / Math.PI)

  // Apply deadzone
  const dz = (v: number) => (Math.abs(v) < dead ? 0 : v - Math.sign(v) * dead)
  const ax = dz(angleX)
  const ay = dz(angleY)

  // Normalize to [-1, 1] based on sensitivity
  const clamp = (v: number, min = -1, max = 1) =>
    Math.max(min, Math.min(max, v))
  const xNorm = clamp(ax / sensitivity) * (invX ? -1 : 1)
  const yNorm = clamp(ay / sensitivity) * (invY ? -1 : 1)

  // Map to pixel space
  const xPix = (xNorm * 0.5 + 0.5) * w
  const yPix = (yNorm * 0.5 + 0.5) * h

  return [xPix, yPix]
}
