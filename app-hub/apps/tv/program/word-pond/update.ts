// tv/word-pond/update.ts
import { WordPondMsg } from '@shared/types'
import type { Model } from './types'
import type { TVCtx } from '../types'
import { drawWordPondIO } from './draw'

const dist2 = (a: number, b: number, c: number, d: number) => {
  const dx = a - c
  const dy = b - d
  return dx * dx + dy * dy
}

export const update = (msg: any, model: Model, _dispatch: any, ctx: TVCtx) => {
  const s = model
  const w = ctx.screenW
  const h = ctx.screenH

  const pondH = 80
  const netR = 40
  const netR2 = netR * netR

  switch (msg.type) {
    case WordPondMsg.NET_UPDATE: {
      const id = msg.msg.id

      if (!s.nets[id]) {
        s.nets[id] = { id, x: w / 2, y: h / 2 }
        s.ponds[id] = { id, letters: [] }
        if (!s.players.includes(id)) s.players.push(id)
      }

      s.nets[id].x = msg.msg.x * w
      s.nets[id].y = msg.msg.y * (h - pondH)

      return { model: { ...s }, effects: [drawWordPondIO(s)] }
    }

    case WordPondMsg.SHAKE: {
      const id = msg.msg.id
      const pond = s.ponds[id]
      if (pond?.letters.length) {
        const last = pond.letters.pop()
        const letter = s.letters.find(
          (l) => l.caughtBy === id && l.char === last
        )
        if (letter) {
          letter.caughtBy = null
          letter.x = Math.random() * w
          letter.y = 0
        }
      }
      return { model: { ...s }, effects: [drawWordPondIO(s)] }
    }

    case 'TICK': {
      for (const l of s.letters) {
        if (l.caughtBy) continue

        l.x += l.vx
        l.y += l.vy

        if (l.x < 0) {
          l.x = 0
          l.vx = Math.abs(l.vx)
        } else if (l.x > w) {
          l.x = w
          l.vx = -Math.abs(l.vx)
        }

        if (l.y > h - pondH) {
          l.y = 0
          l.x = Math.random() * w
        }

        for (const pid of s.players) {
          const net = s.nets[pid]
          if (!net) continue
          if (dist2(l.x, l.y, net.x, net.y) <= netR2) {
            l.caughtBy = pid
            s.ponds[pid].letters.push(l.char)
            break
          }
        }
      }

      return { model: { ...s }, effects: [drawWordPondIO(s)] }
    }

    default:
      return { model: s, effects: [] }
  }
}
