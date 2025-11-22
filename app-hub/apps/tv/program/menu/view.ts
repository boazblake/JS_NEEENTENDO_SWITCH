import { div, h1, button } from '@shared/renderer'
import { Screen } from '@shared/types'

export const view = (model: any, dispatch: any) =>
  div(
    {
      className:
        'min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white text-center'
    },
    [
      h1({ className: 'text-5xl font-bold mb-8' }, 'Main Menu'),

      button(
        {
          className:
            'px-8 py-4 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-600 text-lg font-semibold shadow-lg hover:scale-105 transition',
          onclick: () => dispatch({ type: 'NAVIGATE', to: Screen.CALIBRATION })
        },
        '🧭 Calibration'
      ),

      button(
        {
          className:
            'mt-6 px-8 py-4 rounded-lg bg-gradient-to-r from-pink-500 to-rose-600 text-lg font-semibold shadow-lg hover:scale-105 transition',
          onclick: () => dispatch({ type: 'NAVIGATE', to: Screen.SPRAYCAN })
        },
        '🎨 Start Spray-Can'
      ),

      button(
        {
          className:
            'mt-6 px-8 py-3 rounded bg-slate-700 hover:bg-slate-600 text-slate-300',
          onclick: () => dispatch({ type: 'NAVIGATE', to: Screen.LOBBY })
        },
        '🔙 Back to Lobby'
      )
    ]
  )
