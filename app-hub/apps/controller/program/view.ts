import { div, h1, h2 } from '@/renderer.js'
import type { Model } from './types.js'

export const view = (model: Model) =>
  div(
    {
      class:
        'h-screen w-screen flex flex-col justify-center items-center bg-slate-900 text-white'
    },
    [
      h1({ class: 'text-5xl font-bold mb-4' }, 'Nexus Arcade (Controller)'),
      h2(
        { class: 'text-lg text-slate-400 mb-6' },
        `Session Code: ${model.session}`
      ),
      h2(
        { class: 'text-sm text-teal-400 mb-8' },
        model.status === 'connected' ? 'Connected to TV' : 'Waiting for TV...'
      ),
      model.slot
        ? h2(
            { class: 'text-2xl font-semibold text-teal-300' },
            `Assigned Slot: ${model.slot}`
          )
        : null
    ]
  )
