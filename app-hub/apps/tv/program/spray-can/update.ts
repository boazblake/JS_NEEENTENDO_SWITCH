import { IO } from 'algebraic-js'
import { MessageType } from '@/shared/types.js'
import type { Model, Msg, SprayStart, SprayPoint, SprayEnd } from './types.js'

export const update = (msg: Msg, model: Model) => {
  switch (msg.type) {
    case MessageType.NETWORK_IN: {
      const p = msg.payload as SprayStart | SprayPoint | SprayEnd

      const drawIO = IO(() => {
        const canvas = document.getElementById(
          'sprayCanvas'
        ) as HTMLCanvasElement | null
        const ctx = canvas?.getContext('2d')
        if (!ctx) return

        switch (p.type) {
          case MessageType.SPRAY_START: {
            const start = p as SprayStart
            ctx.beginPath()
            ctx.fillStyle = start.color
            break
          }

          case MessageType.SPRAY_POINT: {
            const point = p as SprayPoint
            const x = point.x * ctx.canvas.width
            const y = point.y * ctx.canvas.height
            ctx.beginPath()
            ctx.arc(x, y, 10 * point.pressure, 0, 2 * Math.PI)
            ctx.fill()
            break
          }

          case MessageType.SPRAY_END:
            ctx.closePath()
            break
        }
      })

      return { model, effects: [drawIO] }
    }

    case MessageType.CLEAR_CANVAS: {
      const clearIO = IO(() => {
        const canvas = document.getElementById(
          'sprayCanvas'
        ) as HTMLCanvasElement | null
        const ctx = canvas?.getContext('2d')
        if (ctx) ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
      })
      return { model, effects: [clearIO] }
    }

    default:
      return { model, effects: [] }
  }
}
