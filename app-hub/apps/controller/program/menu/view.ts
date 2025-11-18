import { div, h1, p } from '@/shared/renderer.js'
export const view = (_model, _dispatch) =>
  div(
    {
      className:
        'min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white text-center'
    },
    [
      h1({ className: 'text-5xl font-extrabold mb-6' }, 'Connected to TV'),
      p({ className: 'text-lg text-slate-400' }, 'Waiting for game selection…')
    ]
  )
