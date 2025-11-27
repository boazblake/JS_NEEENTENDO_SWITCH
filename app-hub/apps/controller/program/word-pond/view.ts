import type { Model, Msg } from './types.js'
import { runDomIO, browserEnv } from 'algebraic-js'
import { getPlayerId } from '@effects/identity'
import { m } from '@shared/mithril-lite'

export const view = (model: Model, dispatch: (m: Msg) => void) =>
  m(
    'div',
    { class: 'controller-view' },

    m('h2', {}, 'WordPond Controller'),

    m('p', {}, model.slot ? `Slot: ${model.slot}` : 'Not registered'),

    model.slot
      ? m(
          'button',
          {
            onclick: async () => {
              const id = (await runDomIO(getPlayerId, browserEnv())).run()
              dispatch({ type: 'UNREGISTER_PLAYER', id, name: model.name })
            }
          },
          'Leave Game'
        )
      : m(
          'button',
          {
            onclick: async () => {
              const id = (await runDomIO(getPlayerId, browserEnv())).run()
              dispatch({ type: 'REGISTER_PLAYER', id, name: model.name })
            }
          },
          'Join Game'
        ),

    Object.keys(model.state).length
      ? m('div', {}, `Players: ${Object.keys(model.state.players).length}`)
      : null
  )
