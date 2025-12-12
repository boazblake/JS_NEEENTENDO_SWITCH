import { layout } from './layout'
import type { TVModel, TVContext, TVMsg } from './types'
import { program as Lobby } from './lobby'
import { program as Menu } from './menu'
import { program as Calibration } from './calibration'
import { program as Spray } from './spray-can'
import { program as WordPond } from './word-pond'
import { program as Driving } from './driving/'
import { program as PacMan } from './pac-man/'

export const view = (model: TVModel, dispatch: (msg: TVMsg) => void) => {
  const ctx: TVContext = {
    session: model.session,
    screenW: model.screenW,
    screenH: model.screenH,
    controllers: model.controllers,
    actions: model.actions,
    players: model.players
  }

  let content

  switch (model.screen) {
    case 'menu':
      content = model.menu
        ? Menu.view(model.menu, dispatch, ctx)
        : Lobby.view(model.lobby, dispatch, ctx)
      break

    case 'calibration':
      content = model.calibration
        ? Calibration.view(model.calibration, dispatch, ctx)
        : Lobby.view(model.lobby, dispatch, ctx)
      break

    case 'spraycan':
      content = model.spray
        ? Spray.view(model.spray, dispatch, ctx)
        : Lobby.view(model.lobby, dispatch, ctx)
      break

    case 'wordpond':
      content = model.wordpond
        ? WordPond.view(model.wordpond, dispatch, ctx)
        : Lobby.view(model.lobby, dispatch, ctx)
      break

    case 'pacman':
      content = model.pacman
        ? PacMan.view(model.pacman, dispatch, ctx)
        : Lobby.view(model.lobby, dispatch, ctx)
      break

    case 'driving':
      content = model.driving
        ? Driving.view(model.driving, dispatch, ctx)
        : Lobby.view(model.lobby, dispatch, ctx)
      break

    case 'lobby':
    default:
      content = Lobby.view(model.lobby, dispatch, ctx)
  }

  return layout(content, model, dispatch)
}
