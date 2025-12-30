import { m } from 'algebraic-fx'
import { MessageType, Screen, COLORS } from '@shared/types'
import type { TVModel, TVMsg } from './types'

export const layout = (
  content: any,
  model: TVModel,
  dispatch: (m: TVMsg) => void
) => {
  const showBack =
    model.screen === Screen.MENU ||
    model.screen === Screen.CALIBRATION ||
    model.screen === Screen.SPRAYCAN

  const anyHoverMenu = Object.values(model.controllers).some(
    (c) => c.pointer?.hoveredId === 'menu'
  )

  return m(
    'div',
    {
      class:
        'relative min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white'
    },

    m(
      'div',
      {
        class:
          'relative w-full h-full bg-gradient-to-b from-slate-900 to-slate-800 overflow-hidden'
      },

      ...Object.values(model.controllers).map((c, idx) =>
        m('div', {
          class:
            'fixed w-6 h-6 rounded-full pointer-events-none shadow-lg border-2 border-white',
          style: `
            left: 0;
            top: 0;
            transform: translate(${c.pointer.x}px, ${c.pointer.y}px);
            background:${COLORS[idx].hex};
            opacity: ${['pacman', 'driving'].includes(model.screen) ? 0.2 : 1};
            mix-blend-mode: normal;
            filter: none;
            z-index: 999999;
            will-change: transform;
          `
        })
      )
    ),

    m(
      'div',
      {
        class: 'flex-1 flex flex-col items-center justify-center w-full'
      },
      content
    ),

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
              dispatch({
                type: 'Navigate',
                screen: Screen.MENU
              })
          },
          '← Back'
        )
      : null
  )
}
