import { m } from 'algebraic-fx'
import { Screen, MessageType } from '@shared/types'
import type { Model, Msg } from './types'
import type { TVContext } from '../types'

export const view = (
  _model: Model,
  dispatch: (msg: Msg) => void,
  _ctx: TVContext
) =>
  m(
    'div',
    {
      class:
        'relative flex flex-col items-center justify-center min-h-screen text-white bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden'
    },

    m(
      'div',
      {
        class:
          'relative z-10 flex flex-col items-center px-16 py-12 rounded-3xl backdrop-blur-sm bg-white/5 border border-slate-700 shadow-2xl'
      },

      m(
        'h1',
        { class: 'text-6xl font-extrabold tracking-tight mb-10' },
        'Menu'
      ),

      m(
        'div',
        { class: 'flex gap-8' },

        m(
          'button',
          {
            class:
              'px-10 py-6 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-xl font-semibold shadow-lg hover:scale-105 transition',
            onclick: () =>
              dispatch({
                type: MessageType.SELECT_APP,
                app: Screen.WORDPOND
              })
          },
          'Wordpond'
        ),

        m(
          'button',
          {
            class:
              'px-10 py-6 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 text-xl font-semibold shadow-lg hover:scale-105 transition',
            onclick: () =>
              dispatch({
                type: MessageType.SELECT_APP,
                app: Screen.SPRAYCAN
              })
          },
          'Spray Can'
        )
      )
    )
  )
