import type { Model } from './types'
import { m } from 'algebraic-fx'
import type { TVCtx } from '../types'

export const view = (model: Model, dispatch: any, ctx: TVCtx) => {
  const firstController = Object.values(ctx.controllers)[0]
  const hovered = firstController?.pointer.hoveredId ?? null

  return m(
    'div',
    { class: 'flex flex-col items-center gap-6 text-white relative' },

    m(
      'div',
      { class: 'flex flex-col items-center gap-4' },

      ...model.items.map((item) =>
        m(
          'button',
          {
            key: item.id,
            'data-action': item.id,
            class:
              'px-12 py-5 rounded-lg text-xl transition-transform ' +
              (hovered === item.id
                ? 'bg-blue-600 scale-110'
                : 'bg-slate-700 hover:bg-slate-600'),
            onclick: () =>
              dispatch({
                type: 'NAVIGATE',
                msg: { to: item.screen }
              })
          },
          item.label
        )
      )
    )
  )
}
