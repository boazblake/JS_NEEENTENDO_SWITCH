import {
  Reader,
  IO,
  askDocument,
  type DomEnv,
  type Dispatch
} from 'algebraic-js'
import { MessageType, ScreenIn, CalibUpdate } from '@shared/types'
import type { Model, Msg } from './types.js'

/**
 * Convert quaternion -> forward vector and project onto screen plane.
 * Returns normalized [0..1] coordinates.
 */
const projectFromQuaternion = ([x, y, z, w]: [
  number,
  number,
  number,
  number
]) => {
  // forward (device -Z)
  const fx = 2 * (x * z + w * y)
  const fy = 2 * (y * z - w * x)
  const fz = 1 - 2 * (x * x + y * y)

  // project onto screen (ignore Z), normalize to [0,1]
  const nx = (fx + 1) / 2
  const ny = 1 - (fy + 1) / 2
  return [nx, ny]
}

export const update = (msg: Msg, model: Model, dispatch: Dispatch) => {
  switch (msg.type) {
    case MessageType.SCREEN_IN: {
      const payload = (msg as ScreenIn).payload
      switch (payload.type) {
        case 'FLIP_PY':
          return { model: { ...model, flipPY: !model.flipPY }, effects: [] }

        case MessageType.CALIB_UPDATE: {
          const p = payload.msg as CalibUpdate
          const { quaternion, gravity } = p

          // derive x,y from quaternion orientation
          const [nx, ny0] = projectFromQuaternion(quaternion)
          const ny = model.flipPY ? 1 - ny0 : ny0

          const drawReader: Reader<DomEnv, IO<void>> = askDocument.map((doc) =>
            IO(() => {
              const canvas = doc.getElementById(
                'calibrationCanvas'
              ) as HTMLCanvasElement | null
              const ctx = canvas?.getContext('2d')
              if (!ctx) return

              const { width, height } = canvas
              const px = nx * width
              const py = ny * height

              return console.log(px, py)
              ctx.clearRect(0, 0, width, height)

              // --- center reticle ---
              const cx = width / 2
              const cy = height / 2
              const r = 30
              ctx.strokeStyle = 'rgba(255,255,255,0.25)'
              ctx.lineWidth = 2
              ctx.beginPath()
              ctx.arc(cx, cy, r, 0, Math.PI * 2)
              ctx.moveTo(cx - r - 10, cy)
              ctx.lineTo(cx + r + 10, cy)
              ctx.moveTo(cx, cy - r - 10)
              ctx.lineTo(cx, cy + r + 10)
              ctx.stroke()

              // --- phone rectangle ---
              ctx.save()
              ctx.translate(px, py)
              ctx.rotate(Math.atan2(gravity[0], gravity[1])) // roll-ish visual cue
              ctx.fillStyle = '#14b8a6'
              ctx.fillRect(-25, -50, 50, 100)
              ctx.restore()

              // connector
              ctx.strokeStyle = 'rgba(20,184,166,0.5)'
              ctx.lineWidth = 1.5
              ctx.beginPath()
              ctx.moveTo(cx, cy)
              ctx.lineTo(px, py)
              ctx.stroke()

              ctx.fillStyle = 'rgba(255,255,255,0.6)'
              ctx.font = '16px system-ui, sans-serif'
              ctx.fillText(
                `qx:${quaternion.map((v) => v.toFixed(2)).join(',')} gx:${gravity.map((v) => v.toFixed(2)).join(',')}`,
                12,
                24
              )
            })
          )

          return { model, effects: [drawReader] }
        }

        default:
          return { model, effects: [] }
      }
    }

    default:
      return { model, effects: [] }
  }
}
