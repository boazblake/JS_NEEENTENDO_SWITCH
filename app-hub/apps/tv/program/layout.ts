import { div, button, span } from '@shared/renderer'

export const layout = (
  content: any,
  model: any,
  dispatch: (m: any) => void
) => {
  const showBack =
    model.screen === 'menu' ||
    model.screen === 'calibration' ||
    model.screen === 'spraycan'
  const x = model.pointer.x
  const y = model.pointer.y

  return div(
    {
      className:
        'relative min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white'
    },
    [
      div(
        {
          className:
            'relative w-full h-full bg-gradient-to-b from-slate-900 to-slate-800 overflow-hidden'
        },
        Object.keys(model.players).length
          ? [
              div({
                className:
                  'fixed w-6 h-6 rounded-full pointer-events-none shadow-lg border-2 border-white',
                style: `
    left: 0;
    top: 0;
    transform: translate(${x}px, ${y}px);
    background: #14b8a6;       /* teal-500 solid */
    opacity: 1;
    mix-blend-mode: normal;
    filter: none;
    z-index: 999999;
    will-change: transform;
  `
              })
            ]
          : null
      ),

      // main content
      div(
        {
          className: 'flex-1 flex flex-col items-center justify-center w-full'
        },
        content
      ),
      showBack
        ? button(
            {
              'data-action': 'menu',
              className:
                (model.pointer?.hoveredId === 'menu'
                  ? 'outline outline-4 outline-teal-400 '
                  : 'outline-none ') +
                'mt-6 px-8 py-4 rounded-lg bg-gradient-to-r from-pink-500 to-rose-600 text-lg font-semibold shadow-lg hover:scale-105 transition',
              onclick: () =>
                dispatch({ type: 'NAVIGATE', msg: { to: Screen.MENU } })
            },
            '← Back'
          )
        : null
    ]
  )
}
