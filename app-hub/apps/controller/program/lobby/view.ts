import { div, h1, p } from '@/shared/renderer.js'
import type { Model } from './types.js'

export const view = (model: Model) =>
  div(
    {
      className:
        'min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white text-center'
    },
    [
      h1({ className: 'text-5xl font-bold mb-4' }, 'Lobby'),
      p(
        { className: 'text-lg text-slate-400 mb-2' },
        `Session Code: ${model.session || '—'}`
      ),
      p(
        { className: 'text-slate-500' },
        model.connected ? 'Connected!' : 'Waiting for host...'
      )
    ]
  )
