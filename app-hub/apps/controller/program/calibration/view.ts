import { div, h1, p, button } from '@/shared/renderer.js'
import type { Dispatch } from 'algebraic-js'
import type { Model } from './types.js'

/**
 * Compute, normalize, and format numeric calibration values.
 * Returns plain numbers already rounded to fixed precision.
 */
const getLatest = (m: Model) => ({
  alpha: Math.round(Number.isFinite(m.alpha) ? m.alpha : 0),
  x: Math.round(Number.isFinite(m.x) ? m.x * 100 : 50),
  y: Math.round(Number.isFinite(m.y) ? m.y * 100 : 50)
})

export const view = (model: Model, dispatch: Dispatch) => {
  const { alpha, x, y } = getLatest(model)

  return div(
    {
      className:
        'min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-slate-800 text-white text-center px-4'
    },
    [
      h1({ className: 'text-4xl font-bold mb-4' }, 'Calibration'),

      p(
        { className: 'text-slate-400 mb-8' },
        'Tilt or rotate your phone to align with the target on TV.'
      ),

      button(
        {
          className:
            'px-6 py-3 mb-10 rounded-lg bg-teal-600 hover:bg-teal-700 font-semibold transition',
          onclick: () => dispatch({ type: 'ENABLE_MOTION' })
        },
        'Enable Motion Sensors'
      ),

      div({
        className:
          'relative w-72 h-72 border-4 border-teal-400 rounded-2xl bg-slate-900 shadow-inner'
      }),

      p(
        { className: 'text-sm text-slate-500 mt-8' },
        `α:${alpha}°  x:${x}  y:${y}`
      )
    ]
  )
}
