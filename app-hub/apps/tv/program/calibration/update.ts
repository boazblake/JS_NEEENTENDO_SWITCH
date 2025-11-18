import { Reader, IO, askDocument, type DomEnv } from 'algebraic-js'
import { MessageType, ScreenIn, CalibUpdate } from '@/shared/types.js'
import type { Model, Msg } from './types.js'

export const update = (msg: Msg, model: Model) => {
  console.log(msg)
  switch (msg.type) {
    case MessageType.SCREEN_IN: {
      const payload = (msg as ScreenIn).payload

      switch (payload.type) {
        case 'FLIP_PY':
          return { model: { ...model, flipPY: !model.flipPY }, effects: [] }

        case MessageType.CALIB_UPDATE: {
          const p = payload as CalibUpdate

          const drawReader: Reader<DomEnv, IO<void>> = askDocument.map((doc) =>
            IO(() => {
              const canvas = doc.getElementById(
                'calibrationCanvas'
              ) as HTMLCanvasElement | null
              const ctx = canvas?.getContext('2d')
              if (!ctx) return

              const width = canvas.width
              const height = canvas.height

              const px = Math.max(0, Math.min(1, p.x)) * width
              const pyNorm = Math.max(0, Math.min(1, p.y))
              const py = (model.flipPY ? 1 - pyNorm : pyNorm) * height

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

              // --- controller dot ---
              ctx.fillStyle = '#14b8a6'
              ctx.beginPath()
              ctx.arc(px, py, 20, 0, Math.PI * 2)
              ctx.fill()

              // connector line
              ctx.strokeStyle = 'rgba(20,184,166,0.5)'
              ctx.lineWidth = 1.5
              ctx.beginPath()
              ctx.moveTo(cx, cy)
              ctx.lineTo(px, py)
              ctx.stroke()

              ctx.fillStyle = 'rgba(255,255,255,0.6)'
              ctx.font = '16px system-ui, sans-serif'
              ctx.fillText(`x:${p.x.toFixed(2)} y:${p.y.toFixed(2)}`, 12, 24)
            })
          )

          return { model, effects: [drawReader] }
        }
      }

      // falls through if no matching payload.type
      return { model, effects: [] }
    }

    default:
      return { model, effects: [] }
  }
}
