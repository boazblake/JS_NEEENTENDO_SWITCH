import { Screen } from '@shared/types'
import { wrapScreenIn } from '@shared/utils'
import { m } from 'algebraic-fx'

export const view = (model, dispatch) =>
  m(
    'div',
    {
      class:
        'flex items-center justify-center w-screen h-screen bg-slate-900 text-white'
    },

    m(
      'button',
      {
        class:
          'absolute top-8 left-8 px-6 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-300 font-semibold shadow-md',
        onclick: () =>
          dispatch(wrapScreenIn(Screen.CALIBRATION, { type: 'FLIP_PY' }))
      },
      'Flip perspective'
    ),

    m('canvas', {
      id: 'calibrationCanvas',
      width: 1920,
      height: 1080,
      class:
        'w-full h-full rounded-xl border border-slate-700 shadow-inner bg-slate-900'
    })
  )
