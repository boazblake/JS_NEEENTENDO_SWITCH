// shared/orientation.ts
// Gravity-only mapping for a phone lying flat, yaw ignored.
// q is unused. g is [gx, gy, gz] in world coords.
// Center = flat (gx≈0, gy≈0). Sensitivity, deadzone, and inversion are tunable.
export const orientationToXY = (
  _qRaw: number[] | undefined,
  gRaw: number[] | undefined,
  w: number,
  h: number,
  opts?: {
    sensX?: number
    sensY?: number
    dead?: number
    invertX?: boolean
    invertY?: boolean
  }
): [number, number] => {
  const gx = Number(gRaw?.[0] ?? 0)
  const gy = Number(gRaw?.[1] ?? 0)

  const sensX = opts?.sensX ?? 1.0
  const sensY = opts?.sensY ?? 1.0
  const dead = opts?.dead ?? 0.02
  const invX = opts?.invertX ?? true // true → tilt right moves pointer right
  const invY = opts?.invertY ?? true // true → tilt top forward moves pointer up

  const clamp = (v: number, a = -1, b = 1) => Math.max(a, Math.min(b, v))
  const dz = (v: number) => (Math.abs(v) < dead ? 0 : v)

  // Map: x from gx, y from gy. Invert defaults chosen for natural feel on flat phone.
  const xNorm = clamp(dz(gx) * sensX) * (invX ? -1 : 1)
  const yNorm = clamp(dz(gy) * sensY) * (invY ? -1 : 1)

  // Center (0,0) → screen center. Norm ±1 spans full width/height.
  const xPix = (0.5 - xNorm * 0.5) * w
  const yPix = (0.5 - yNorm * 0.5) * h

  return [xPix, yPix]
}
