import { div, h2, p, button } from '@/renderer.js'
import type { Model, Msg } from './types.js'
import { runDomIO, browserEnv } from 'algebraic-js'
import { getPlayerId } from '@/effects/identity.js'

export const view = (model: Model, dispatch: (m: Msg) => void) =>
  div({ class: 'controller-view' }, [
    h2({}, 'WordPond Controller'),
    p({}, model.slot ? `Slot: ${model.slot}` : 'Not registered'),
    model.slot
      ? button(
          {
            onclick: async () => {
              const id = (await runDomIO(getPlayerId, browserEnv())).run()
              dispatch({ type: 'UNREGISTER_PLAYER', id, name: model.name })
            }
          },
          'Leave Game'
        )
      : button(
          {
            onclick: async () => {
              const id = (await runDomIO(getPlayerId, browserEnv())).run()
              dispatch({ type: 'REGISTER_PLAYER', id, name: model.name })
            }
          },
          'Join Game'
        ),
    Object.keys(model.state).length
      ? div({}, `Players: ${Object.keys(model.state.players).length}`)
      : null
  ])
