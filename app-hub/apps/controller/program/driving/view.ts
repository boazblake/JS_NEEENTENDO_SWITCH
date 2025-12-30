import { m } from 'algebraic-fx'
import type { Model } from './types'
import type { ControllerCtx } from '../types'

export const view = (model: Model, _dispatch: any, _ctx: ControllerCtx) => {
  return m(
    'div',
    {
      class:
        'min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white'
    },

    m('h1', { class: 'text-3xl mb-6' }, 'Driving Mode'),

    m('div', { class: 'text-xl mb-4' }, 'Steer: ', model.steer.toFixed(2)),

    m(
      'div',
      { class: 'text-xl mb-4' },
      'Throttle: ',
      model.throttle.toFixed(2)
    ),

    m('div', { class: 'text-xl mb-4' }, 'Brake: ', model.brake.toFixed(2)),

    m(
      'div',
      {
        onclick: () => {
          _dispatch({ type: 'DRIVING_READY' })
        },
        class:
          'mt-10 w-64 h-64 bg-black/30 border border-white/20 rounded-full flex items-center justify-center'
      },
      'Preview'
    )
  )
}
