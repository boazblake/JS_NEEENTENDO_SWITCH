import { div, h2, p, ul, li } from '@/renderer.js'
import type { Model, Msg } from './types.js'

export const view = (model: Model) =>
  div({ class: 'tv-view' }, [
    h2({}, 'Connected Players'),
    ul(
      {},
      Object.values(model.players).map((p) => li({}, `Slot ${p.slot}: ${p.id}`))
    )
  ])
