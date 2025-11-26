import { div, h1, button, ul, li, h2, p, span } from '@shared/renderer'
import { Screen, MessageType } from '@shared/types'

export const view = (model: any, dispatch: any) =>
  div(
    {
      className:
        'relative flex flex-col items-center justify-center min-h-screen text-white bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden'
    },
    [
      // background glow
      div({
        className:
          'absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(14,165,233,0.2),transparent_60%)]'
      }),

      // card
      div(
        {
          className:
            'relative z-10 flex flex-col items-center px-16 py-12 rounded-3xl backdrop-blur-sm bg-white/5 border border-slate-700 shadow-2xl'
        },
        [
          h1(
            { className: 'text-7xl font-extrabold tracking-tight mb-4' },
            'Lobby'
          ),
          p(
            { className: 'text-slate-400 text-xl mb-10' },
            'Join this session to begin'
          ),
          h2(
            { className: 'text-5xl font-mono text-teal-400 mb-10' },
            model.session
          ),
          ul(
            { className: 'space-y-2 text-lg text-teal-200 mb-12' },
            Object.values(model.players).map((p: any) =>
              li({ className: 'flex items-center gap-2' }, [
                span({ className: 'w-3 h-3 bg-teal-400 rounded-full' }),
                `${p.name} – Slot ${p.slot}`
              ])
            )
          ),
          Object.values(model.players).length
            ? button(
                {
                  className:
                    'px-10 py-4 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 font-semibold text-lg shadow-lg hover:scale-105 active:scale-95 transition-transform duration-200',
                  onclick: () =>
                    dispatch({
                      type: MessageType.NAVIGATE,
                      msg: { to: Screen.MENU }
                    })
                },
                'Enter Menu'
              )
            : ''
        ]
      )
    ]
  )
