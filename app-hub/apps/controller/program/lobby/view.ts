import { div, h1, h2, p, ul, li, button, span } from '@shared/renderer'
import type { Model } from './types.js'
import { Screen, MessageType } from '@shared/types'

export const view = (model: Model, dispatch: any) =>
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
            'relative z-10 flex flex-col items-center px-10 py-10 rounded-3xl backdrop-blur-sm bg-white/5 border border-slate-700 shadow-2xl max-w-md w-full'
        },
        [
          h1(
            { className: 'text-6xl font-extrabold tracking-tight mb-4' },
            'Select TV'
          ),

          p(
            { className: 'text-slate-400 text-lg mb-8' },
            'Tap a TV to connect'
          ),
          ul(
            { className: 'w-full space-y-3 mb-8' },
            model.availableTvs.map((tvId: any) =>
              li(
                {
                  id: tvId,
                  className:
                    'flex items-center justify-between px-6 py-4 rounded-xl bg-white/10 border border-slate-700 hover:bg-white/15 transition-colors cursor-pointer',
                  onclick: () =>
                    dispatch({
                      type: MessageType.CONNECT_TO_TV,
                      msg: { tvId }
                    })
                },
                [
                  (span(
                    { className: 'text-xl font-medium text-teal-300' },
                    tvId
                  ),
                  span({ className: 'text-slate-400 text-sm font-mono' }, tvId))
                ]
              )
            ),
            !model.availableTvs.length
              ? [
                  li(
                    {
                      className:
                        'text-center text-slate-500 italic py-6 select-none'
                    },
                    'No TVs discovered on this network'
                  )
                ]
              : []
          ),

          model.connectedTV
            ? div({ className: 'text-center mt-4' }, [
                h2(
                  { className: 'text-3xl font-mono text-teal-400 mb-4' },
                  model.connectedTV.name
                ),
                button(
                  {
                    className:
                      'px-10 py-4 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 font-semibold text-lg shadow-lg hover:scale-105 active:scale-95 transition-transform duration-200',
                    onclick: () =>
                      dispatch({
                        type: MessageType.NAVIGATE,
                        to: Screen.LOBBY
                      })
                  },
                  'Join Lobby'
                )
              ])
            : ''
        ]
      )
    ]
  )
