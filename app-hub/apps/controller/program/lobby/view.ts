import type { Model, Msg } from './types'
import { m } from 'algebraic-fx'

export const view = (model: Model, dispatch: (m: Msg) => void) => {
  return m(
    'div',
    {
      class:
        'flex flex-col items-center justify-center h-full text-white bg-slate-900'
    },

    m('h1', { class: 'text-5xl mb-4' }, 'Select TV'),

    m('p', { class: 'text-slate-400 mb-8' }, 'Tap a TV to connect'),

    m(
      'ul',
      { class: 'w-full max-w-md space-y-3' },

      ...model.availableTvs.map((session) =>
        m(
          'li',
          {
            key: session,
            class:
              'px-6 py-4 rounded-lg bg-white/10 border border-slate-700 hover:bg-white/20 cursor-pointer',
            onclick: () => dispatch({ type: 'SELECT_TV', msg: { session } })
          },
          m('span', { class: 'font-semibold text-lg text-teal-400' }, session)
        )
      ),

      model.availableTvs.length === 0
        ? m(
            'li',
            {
              class: 'text-center text-slate-500 italic py-6 select-none'
            },
            'No TVs discovered on this network'
          )
        : null
    )
  )
}
