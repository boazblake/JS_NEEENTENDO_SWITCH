import { m } from 'algebraic-fx'
import { MessageType, Screen } from '@shared/types'

export const view = (model, dispatch, ctx) => {
  return m(
    'div',
    {
      class:
        'relative flex flex-col items-center justify-center min-h-screen text-white bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden'
    },

    // background glow
    m('div', {
      class:
        'absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(14,165,233,0.2),transparent_60%)]'
    }),

    // card
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

      // // players
      // m(
      //   'ul',
      //   { class: 'space-y-2 text-lg text-teal-200 mb-12' },
      //   ...Object.values(model.controllers).map((p) =>
      //     m(
      //       'li',
      //       { key: p.slot, class: 'flex items-center gap-2' },
      //
      //       m('span', {
      //         class: 'w-3 h-3 bg-teal-400 rounded-full'
      //       }),
      //
      //       `${p.name} – Slot ${p.slot}`
      //     )
      //   )
      // ),

      // Object.values(model.players).length
      //   ? m(
      //       'button',
      //       {
      //         class:
      //           'px-10 py-4 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 font-semibold text-lg shadow-lg hover:scale-105 active:scale-95 transition-transform duration-200',
      //         onclick: () =>
      //           dispatch({
      //             type: MessageType.NAVIGATE,
      //             msg: { to: Screen.MENU }
      //           })
      //       },
      //       'Enter Menu'
      //     )
      //   : m('') // empty vnode instead of string
    )
  )
}
