import { div, h1, p } from '@/shared/renderer.js'
import type { Model } from './types.js'

export const view = (model: Model) =>
  div(
    {
      className:
        'min-h-screen flex flex-col items-center justify-center has-background-dark has-text-white has-text-centered'
    },
    [
      h1({ className: 'title is-1' }, 'Lobby'),
      p(
        { className: 'subtitle is-4 has-text-grey-lighter mb-2' },
        `Session Code: ${model.session || '—'}`
      ),
      p(
        { className: 'has-text-grey' },
        model.connected ? 'Connected!' : 'Waiting for host...'
      )
    ]
  )
