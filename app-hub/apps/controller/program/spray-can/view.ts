import { m } from '@shared/mithril-lite'
import { MessageType, COLORS } from '@shared/types'

export const view = (model, dispatch) => {
  const current = model.spray.color ?? 'teal'
  const getColor = (c) => COLORS.find((x) => x.color === current)

  return m(
    'div',
    {
      class:
        'min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-slate-800 text-white px-6'
    },

    m('h1', { class: 'text-3xl font-bold mb-6' }, 'Spray Mode'),

    //
    // Color Picker
    //
    m(
      'div',
      {
        class: 'flex flex-wrap justify-center gap-3 mb-10 w-full max-w-md'
      },

      ...COLORS.map((c) =>
        m(
          'button',
          {
            key: c.color,
            'data-color': c.color,
            class:
              'w-10 h-10 rounded-full border-2 transition-transform ' +
              (c.color === current
                ? 'border-white scale-110'
                : 'border-slate-600 hover:scale-105'),
            style: `background:${c.hex};`,
            onclick: () => dispatch(MessageType.SPRAY_START, c)
          },

          m('span', { class: 'sr-only' }, c.color)
        )
      )
    ),

    //
    // Trigger Button
    //
    m(
      'button',
      {
        class:
          'mt-4 px-10 py-5 text-xl font-semibold rounded-full bg-gradient-to-r ' +
          'from-teal-500 to-emerald-600 shadow-lg active:scale-95 transition-transform ' +
          'select-none touch-none',
        style: `
          -webkit-user-select: none;
          user-select: none;
          -webkit-touch-callout: none;
          -webkit-tap-highlight-color: transparent;
        `,

        ontouchstart: () => dispatch(MessageType.SPRAY_POINT, { active: true }),
        ontouchend: () =>
          dispatch(MessageType.SPRAY_END, {
            active: false,
            ...getColor(current)
          }),

        onmousedown: () => dispatch(MessageType.SPRAY_POINT, { active: true }),
        onmouseup: () =>
          dispatch(MessageType.SPRAY_END, {
            active: false,
            ...getColor(current)
          })
      },
      'SPRAY'
    ),

    m(
      'p',
      { class: 'text-slate-400 mt-8 text-center max-w-sm' },
      'Pick a color, then hold the button to spray on the TV.'
    )
  )
}
