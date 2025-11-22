import { div, h1, p } from '@shared/renderer'
export const view = (model, dispatch) =>
  div(
    {
      className:
        'min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-slate-800 text-white'
    },
    [
      h1({ className: 'text-3xl font-bold mb-6' }, 'Spray Mode'),
      p({ className: 'text-slate-400 mt-6' }, 'Spray on the TV!')
    ]
  )
