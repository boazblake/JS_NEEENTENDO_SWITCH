import { m } from '@shared/mithril-lite'
import { Screen, COLORS } from '@shared/types'

export const layout = (
  content: any,
  model: any,
  dispatch: (m: any) => void
) => {
  const showBack =
    model.screen === 'menu' ||
    model.screen === 'calibration' ||
    model.screen === 'spraycan'

  // derive hover state across all controllers
  const anyHoverMenu = Object.values(model.controllers).some(
    (c: any) => c.pointer?.hoveredId === 'menu'
  )

  return m(
    'div',
    {
      class:
        'relative min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white'
    },

    // pointer container
    m(
      'div',
      {
        class:
          'relative w-full h-full bg-gradient-to-b from-slate-900 to-slate-800 overflow-hidden'
      },

      ...Object.values(model.controllers).map((c: any, idx: number) => {
        return m('div', {
          class:
            'fixed w-6 h-6 rounded-full pointer-events-none shadow-lg border-2 border-white',
          style: `
            left: 0;
            top: 0;
            transform: translate(${c.pointer.x}px, ${c.pointer.y}px);
            background:${COLORS[idx].hex};
            opacity: 1;
            mix-blend-mode: normal;
            filter: none;
            z-index: 999999;
            will-change: transform;
          `
        })
      })
    ),

    // main content wrapper
    m(
      'div',
      {
        class: 'flex-1 flex flex-col items-center justify-center w-full'
      },
      content
    ),

    // back button
    showBack
      ? m(
          'button',
          {
            'data-action': 'menu',
            class:
              (anyHoverMenu
                ? 'outline outline-4 outline-teal-400 '
                : 'outline-none ') +
              'mt-6 px-8 py-4 rounded-lg bg-gradient-to-r from-pink-500 to-rose-600 text-lg font-semibold shadow-lg hover:scale-105 transition',
            onclick: () =>
              dispatch({ type: 'NAVIGATE', msg: { to: Screen.MENU } })
          },
          '← Back'
        )
      : null
  )
}
