import { m } from '@shared/mithril-lite'
import type { ControllerMenuModel, ControllerCtx } from '../types'

export const view = (
  model: ControllerMenuModel,
  dispatch: any,
  ctx: ControllerCtx
) => {
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
