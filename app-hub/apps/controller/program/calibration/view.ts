import { m } from 'algebraic-fx'
import type { Dispatch } from 'algebraic-fx'
import type { Model } from './types.js'

/**
 * Format vector numbers with fixed precision.
 */
const fmt = (v: number, n = 2) => (Number.isFinite(v) ? v.toFixed(n) : '0.00')

/**
 * Extract latest motion values safely from model.
 */
const getLatest = (m: Model) => ({
  gravity: m.gravity ?? [0, 0, 0],
  quaternion: m.quaternion ?? [0, 0, 0, 1],
  rotation: m.rotation ?? [0, 0, 0],
  timestamp: m.timestamp
})

export const view = (model: Model, dispatch: Dispatch) => {
  const { gravity, quaternion, rotation } = getLatest(model)

  return m(
    'div',
    {
      class:
        'min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-slate-800 text-white text-center px-4'
    },

    m('h1', { class: 'text-4xl font-bold mb-4' }, 'Calibration'),

    m(
      'p',
      { class: 'text-slate-400 mb-8' },
      'Tilt or rotate your phone — values update in real time.'
    ),

    m(
      'button',
      {
        class:
          'px-6 py-3 mb-10 rounded-lg bg-teal-600 hover:bg-teal-700 font-semibold transition',
        onclick: () => dispatch({ type: 'ENABLE_MOTION' })
      },
      'Enable Motion Sensors'
    ),

    m(
      'div',
      {
        class:
          'relative w-72 h-72 border-4 border-teal-400 rounded-2xl bg-slate-900 shadow-inner flex flex-col items-center justify-center'
      },

      m(
        'p',
        { class: 'text-teal-400 font-mono text-sm' },
        `gravity: [ ${fmt(gravity[0])}, ${fmt(gravity[1])}, ${fmt(
          gravity[2]
        )} ]`
      ),

      m(
        'p',
        { class: 'text-emerald-400 font-mono text-sm mt-2' },
        `quat: [ ${fmt(quaternion[0])}, ${fmt(quaternion[1])}, ${fmt(
          quaternion[2]
        )}, ${fmt(quaternion[3])} ]`
      ),

      m(
        'p',
        { class: 'text-emerald-400 font-mono text-sm mt-2' },
        `quat: [ ${fmt(rotation[0])}, ${fmt(rotation[1])}, ${fmt(
          rotation[2]
        )} ]`
      )
    ),

    m(
      'pre',
      {
        class: 'text-xs text-slate-500 mt-6 font-mono whitespace-pre-wrap'
      },
      JSON.stringify({ gravity, quaternion, rotation }, null, 2)
    )
  )
}
