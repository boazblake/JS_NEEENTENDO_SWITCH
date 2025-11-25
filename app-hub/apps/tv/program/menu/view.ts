import { div, h1, button } from '@shared/renderer'
import { Screen } from '@shared/types'

export const view = (model, dispatch) => {
  const hovered = model.pointer?.hoveredId ?? null

  return div(
    {
      className:
        'relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white text-center overflow-hidden'
    },
    [
      h1({ className: 'text-5xl font-bold mb-8' }, 'Main Menu'),

      // --- Calibration ------------------------------------------------------
      button(
        {
          'data-action': 'calibration',
          className:
            (hovered === 'calibration'
              ? 'outline outline-4 outline-teal-400 '
              : 'outline-none ') +
            'px-8 py-4 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-600 text-lg font-semibold shadow-lg hover:scale-105 transition',
          onclick: () =>
            dispatch({ type: 'NAVIGATE', msg: { to: Screen.CALIBRATION } })
        },
        '🧭 Calibration'
      ),

      // --- Spray-can --------------------------------------------------------
      button(
        {
          'data-action': 'spraycan',
          className:
            (hovered === 'spraycan'
              ? 'outline outline-4 outline-teal-400 '
              : 'outline-none ') +
            'mt-6 px-8 py-4 rounded-lg bg-gradient-to-r from-pink-500 to-rose-600 text-lg font-semibold shadow-lg hover:scale-105 transition',
          onclick: () =>
            dispatch({ type: 'NAVIGATE', msg: { to: Screen.SPRAYCAN } })
        },
        '🎨 Start Spray-Can'
      ),

      // --- Lobby ------------------------------------------------------------
      button(
        {
          'data-action': 'lobby',
          className:
            (hovered === 'lobby'
              ? 'outline outline-4 outline-teal-400 '
              : 'outline-none ') +
            'mt-6 px-8 py-3 rounded bg-slate-700 hover:bg-slate-600 text-slate-300',
          onclick: () =>
            dispatch({ type: 'NAVIGATE', msg: { to: Screen.MENU } })
        },
        '🔙 Back to Lobby'
      )
    ]
  )
}
