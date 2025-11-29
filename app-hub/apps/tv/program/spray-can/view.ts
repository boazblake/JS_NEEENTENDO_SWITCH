// tv/spray-can/view.ts
import { m } from '@shared/mithril-lite'
import type { Model } from './types'
import type { TVCtx } from '../types'

export const view = (_model: Model, _dispatch: any, _ctx: TVCtx) =>
  m(
    'div',
    {
      class: 'fixed inset-0 bg-slate-900 pointer-events-none overflow-hidden'
    },
    m('canvas', {
      id: 'spray-canvas',
      width: window.innerWidth,
      height: window.innerHeight,
      class: 'w-full h-full block'
    })
  )
