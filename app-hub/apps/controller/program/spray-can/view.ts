import { div, h1, p, button, span } from '@shared/renderer'
import { MessageType } from '@shared/types'

const COLORS = [
  { color: 'red', hex: '#ef4444' },
  { color: 'orange', hex: '#f97316' },
  { color: 'yellow', hex: '#eab308' },
  { color: 'green', hex: '#22c55e' },
  { color: 'teal', hex: '#14b8a6' },
  { color: 'blue', hex: '#3b82f6' },
  { color: 'purple', hex: '#8b5cf6' },
  { color: 'pink', hex: '#ec4899' }
]

export const view = (model, dispatch) => {
  const current = model.color ?? 'teal'
  const getColor = (c) => COLORS.find((c) => c.color === current)

  return div(
    {
      className:
        'min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-slate-800 text-white px-6'
    },
    [
      h1({ className: 'text-3xl font-bold mb-6' }, 'Spray Mode'),

      // --- Color Picker ----------------------------------------------------
      div(
        {
          className: 'flex flex-wrap justify-center gap-3 mb-10 w-full max-w-md'
        },
        COLORS.map((c) =>
          button(
            {
              'data-color': c.color,
              className:
                'w-10 h-10 rounded-full border-2 transition-transform ' +
                (c.color === current
                  ? 'border-white scale-110'
                  : 'border-slate-600 hover:scale-105'),
              style: `background:${c.hex};`,
              onclick: () => dispatch(MessageType.SPRAY_START, c)
            },
            span({ className: 'sr-only' }, c.color)
          )
        )
      ),

      // --- Trigger Button --------------------------------------------------
      button(
        {
          className:
            'mt-4 px-10 py-5 text-xl font-semibold rounded-full bg-gradient-to-r from-teal-500 to-emerald-600 shadow-lg active:scale-95 transition-transform',
          ontouchstart: () =>
            dispatch(MessageType.SPRAY_POINT, { active: true }),
          ontouchend: () =>
            dispatch(MessageType.SPRAY_END, {
              active: false,
              ...getColor(current)
            }),
          onmousedown: () =>
            dispatch(MessageType.SPRAY_POINT, { active: true }),
          onmouseup: () =>
            dispatch(MessageType.SPRAY_END, {
              active: false,
              ...getColor(current)
            })
        },
        'SPRAY'
      ),

      p(
        { className: 'text-slate-400 mt-8 text-center max-w-sm' },
        'Pick a color, then hold the button to spray on the TV.'
      )
    ]
  )
}
