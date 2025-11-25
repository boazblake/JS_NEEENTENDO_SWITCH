import { div, h1, p, ul, li, span } from '@shared/renderer'
import type { Model } from './types.js'
import { MessageType } from '@shared/types'
import type { Dispatch } from 'algebraic-js'

export const view = (model: Model, dispatch: Dispatch) =>
  div(
    {
      className:
        'flex flex-col items-center justify-center min-h-screen text-white bg-slate-900'
    },
    [
      h1({ className: 'text-5xl mb-4' }, 'Select TV'),
      p({ className: 'text-slate-400 mb-8' }, 'Tap a TV to connect'),
      ul(
        { className: 'w-full max-w-md space-y-3' },
        model.availableTvs.length
          ? model.availableTvs.map((tvId) =>
              li(
                {
                  id: tvId,
                  className:
                    'px-6 py-4 rounded-lg bg-white/10 border border-slate-700 hover:bg-white/20 cursor-pointer',
                  onclick: () => dispatch('SELECT_TV', { tvId })
                },
                [
                  span(
                    { className: 'font-semibold text-lg text-teal-400' },
                    tvId
                  )
                ]
              )
            )
          : [
              li(
                {
                  className:
                    'text-center text-slate-500 italic py-6 select-none'
                },
                'No TVs discovered on this network'
              )
            ]
      )
    ]
  )
