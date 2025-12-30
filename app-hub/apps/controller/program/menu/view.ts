import { m } from 'algebraic-fx'
import type { ControllerMenuModel, ControllerCtx } from '../types'

import { MessageType } from '@shared/types'

export const view = (
  model: ControllerMenuModel,
  dispatch: any,
  ctx: ControllerCtx
) => {
  const hovered = ctx.hoveredId
  return m(
    'div',
    {
      class:
        'flex flex-col items-center justify-center h-full  text-white bg-slate-900'
    },
    m(
      'ion-button',
      {
        class:
          'mx-4 mt-3 bg-blue-600 py-2 rounded text-lg active:scale-95 text-white w-[calc(100%-2rem)]',
        onclick: () => {
          if (!hovered) return
          window.dispatch({
            type: MessageType.NAVIGATE,
            msg: { screen: hovered }
          })
        }
      },
      `Select: ${hovered ?? '...'}`
    )
  )
  // const actions = ctx.tvActions ?? [] // derived from TV
  // const hovered = ctx.hoveredId ?? null // derived from TV
  //
  // return m(
  //   'div',
  //   { class: 'p-4 w-full flex flex-col gap-3' },
  //
  //   m('div', { class: 'text-lg font-semibold' }, 'Menu'),
  //
  //   m(
  //     'div',
  //     { class: 'text-sm opacity-80' },
  //     hovered ? `Hover: ${hovered}` : 'Hover: none'
  //   )
  // )
}
