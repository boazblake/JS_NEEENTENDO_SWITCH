import { div, h1, p, button } from '@shared/renderer'
import { MessageType, Screen } from '@shared/types'

export const view = (model, dispatch) => {
  const hovered = model.hoverId ?? null

  return div(
    {
      className:
        'min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white text-center px-6'
    },
    [
      h1({ className: 'text-5xl font-extrabold mb-6' }, 'Connected to TV'),

      hovered
        ? p(
            { className: 'text-lg text-teal-400 mb-10' },
            `TV Highlight: ${hovered}`
          )
        : p(
            { className: 'text-lg text-slate-400 mb-10' },
            'Waiting for game selection…'
          ),

      // confirm / select button
      button(
        {
          disabled: !hovered,
          className:
            'mt-6 px-10 py-4 rounded-xl text-lg font-semibold transition ' +
            (hovered
              ? 'bg-gradient-to-r from-teal-500 to-emerald-600 hover:scale-105 shadow-lg'
              : 'bg-slate-700 text-slate-500 cursor-not-allowed'),
          onclick: () => {
            if (!hovered) return
            dispatch(MessageType.APP_SELECTED, {
              app: hovered,
              screen: Screen.LOBBY
            })
          }
        },
        hovered ? `Play ${hovered}` : 'Waiting…'
      )
    ]
  )
}
