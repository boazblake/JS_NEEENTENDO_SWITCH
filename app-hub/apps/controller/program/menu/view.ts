import { div, h1, p, button } from '@shared/renderer'
import { MessageType, Screen } from '@shared/types'

export const view = (model, dispatch) => {
  const hovered = model.hoverId

  return div(
    {
      className:
        'min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white text-center px-6'
    },
    [
      h1({ className: 'text-5xl font-extrabold mb-6' }, 'Connected to TV'),

      !hovered
        ? p(
            { className: 'text-lg text-slate-400 mt-6' },
            'Waiting for game selection…'
          )
        : button(
            {
              className:
                'mt-10 px-10 py-5 rounded-xl text-xl font-semibold bg-gradient-to-r from-teal-500 to-emerald-600 shadow-lg hover:scale-105 active:scale-95 transition-transform',
              onclick: () =>
                dispatch(MessageType.APP_SELECTED, {
                  app: hovered,
                  screen: Screen.LOBBY
                })
            },
            `Play ${hovered}`
          )
    ]
  )
}
