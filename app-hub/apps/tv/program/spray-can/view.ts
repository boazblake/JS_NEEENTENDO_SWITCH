import { m } from '@shared/mithril-lite'

export const view = () =>
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
