import { m } from '@shared/mithril-lite'
import { Screen } from '@shared/types'

export const view = (model: any, dispatch: any) =>
  m(
    'div',
    { class: 'flex flex-col items-center gap-6 text-white' },

    m('h1', { class: 'text-5xl font-bold' }, 'Main Menu'),

    m(
      'button',
      {
        'data-action': 'calibration',
        onclick: () =>
          dispatch({ type: 'NAVIGATE', msg: { to: Screen.CALIBRATION } }),
        class:
          'px-12 py-5 rounded-lg text-xl bg-gradient-to-r from-yellow-500 to-orange-600'
      },
      'Calibration'
    ),

    m(
      'button',
      {
        'data-action': 'spraycan',
        onclick: () =>
          dispatch({ type: 'NAVIGATE', msg: { to: Screen.SPRAYCAN } }),
        class:
          'px-12 py-5 rounded-lg text-xl bg-gradient-to-r from-pink-500 to-rose-600'
      },
      'Spray Can'
    ),

    m(
      'button',
      {
        'data-action': 'lobby',
        onclick: () =>
          dispatch({ type: 'NAVIGATE', msg: { to: Screen.LOBBY } }),
        class: 'px-12 py-5 rounded-lg text-xl bg-slate-700'
      },
      'Back to Lobby'
    )
  )
