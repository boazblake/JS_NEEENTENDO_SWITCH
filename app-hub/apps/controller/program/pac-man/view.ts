import { m } from '@shared/mithril-lite'
import type { Model } from './types'
import type { ControllerCtx } from '../types'

const arrow = (dir: Model['dir']) => {
  switch (dir) {
    case 'up':
      return '⬆'
    case 'down':
      return '⬇'
    case 'left':
      return '⬅'
    case 'right':
      return '➡'
    default:
      return '●'
  }
}

export const view = (model: Model, _dispatch: any, _ctx: ControllerCtx) =>
  m(
    'div',
    {
      class:
        'min-h-screen flex flex-col items-center justify-center bg-black text-white'
    },
    m('h1', { class: 'text-3xl mb-4' }, 'Pac-Man'),
    m('div', { class: 'text-7xl mb-8 select-none' }, arrow(model.dir)),
    m('p', { class: 'text-lg text-slate-400' }, 'Tilt to move')
  )
