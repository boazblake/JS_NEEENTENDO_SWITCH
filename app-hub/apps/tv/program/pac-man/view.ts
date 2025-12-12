import { m } from 'algebraic-fx'
export const view = (_model, _dispatch, _ctx) =>
  m('canvas', {
    id: 'pacman-canvas',
    class: 'w-full h-full'
  })
