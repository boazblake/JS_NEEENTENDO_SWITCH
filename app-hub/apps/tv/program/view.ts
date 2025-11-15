import { div, h1, h2, ul, li } from '@/renderer.js'
import type { Model } from './types.js'

export const view = (model: Model) =>
  div(
    {
      class:
        'h-screen w-screen flex flex-col justify-center items-center bg-slate-900 text-white'
    },
    [
      h1({ class: 'text-5xl font-bold mb-4' }, 'Nexus Arcade (TV)'),
      h2(
        { class: 'text-lg text-slate-400 mb-6' },
        `Session Code: ${model.session}`
      ),
      h2(
        { class: 'text-sm text-teal-400 mb-8' },
        model.status === 'connected' ? 'Relay Connected' : 'Connecting...'
      ),
      h2(
        { class: 'text-2xl font-semibold mb-4' },
        `Players Connected: ${Object.keys(model.players).length}`
      ),
      ul(
        { class: 'text-xl space-y-2' },
        Object.values(model.players).map((p) =>
          li({ class: 'text-teal-300 font-mono' }, `${p.name} — Slot ${p.slot}`)
        )
      )
    ]
  )
