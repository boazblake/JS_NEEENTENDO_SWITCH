import { m } from '@shared/mithril-lite'

export const view = (_model, _dispatch, _ctx) =>
  m('canvas', {
    id: 'pacman-canvas',
    class: 'w-full h-full'
  })
