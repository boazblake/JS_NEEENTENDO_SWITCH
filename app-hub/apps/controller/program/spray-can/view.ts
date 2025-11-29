// controller/spray-can/view.ts
import { m } from '@shared/mithril-lite'
import { MessageType, COLORS } from '@shared/types'
import type { Model } from './types'
import type { ControllerCtx } from '../types'

export const view = (model: Model, dispatch: any, _ctx: ControllerCtx) => {
  const current = model.color
  const getColor = (c: string) => COLORS.find((x) => x.color === c)!

  return m(
    'div',
    {
      class:
        'min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-slate-800 text-white px-6'
    },
    m('h1', { class: 'text-3xl font-bold mb-6' }, 'Spray Mode'),

    m(
      'div',
      { class: 'flex flex-wrap justify-center gap-3 mb-10 w-full max-w-md' },
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
            onclick: () => {
              dispatch('SET_COLOR', { color: c.color })
              dispatch(MessageType.SPRAY_START, { color: c.color })
            }
          },
          m('span', { class: 'sr-only' }, c.color)
        )
      )
    ),

    m(
      'button',
      {
        class:
          'mt-4 px-10 py-5 text-xl font-semibold rounded-full bg-teal-600 active:scale-95 transition-transform',
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
    )
  )
}
