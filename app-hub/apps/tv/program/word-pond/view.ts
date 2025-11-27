import { m } from '@shared/mithril-lite'
import type { Model, Msg } from './types.js'

export const view = (model: Model) =>
  m(
    'div',
    { class: 'tv-view' },

    m('h2', {}, 'Connected Players'),

    m(
      'ul',
      {},

      ...Object.values(model.players).map((p) =>
        m('li', { key: p.slot }, `Slot ${p.slot}: ${p.id}`)
      )
    )
  )
