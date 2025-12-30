import { m } from 'algebraic-fx'
import { MessageType, Screen } from '@shared/types'
import type { Model, Msg } from './types'
import type { TVContext } from '../types'

export const view = (
  model: Model,
  dispatch: (msg: Msg) => void,
  ctx: TVContext
) => {
  return m(
    'div',
    {
      class:
        'relative flex flex-col items-center justify-center min-h-screen text-white bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden'
    },

    m('div', {
      class:
        'absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(14,165,233,0.2),transparent_60%)]'
    }),

    m(
      'div',
      {
        class:
          'relative z-10 flex flex-col items-center px-16 py-12 rounded-3xl backdrop-blur-sm bg-white/5 border border-slate-700 shadow-2xl'
      },

      m(
        'h1',
        { class: 'text-7xl font-extrabold tracking-tight mb-4' },
        'Lobby'
      ),

      m(
        'p',
        { class: 'text-slate-400 text-xl mb-10' },
        'Join this session to begin'
      ),

      m('h2', { class: 'text-5xl font-mono text-teal-400 mb-10' }, ctx.session)
    )
  )
}
