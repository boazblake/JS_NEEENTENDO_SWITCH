// tv/view.ts
import { layout } from './layout'
import type { TVModel, TVCtx } from './types'
import { program as Lobby } from './lobby'
import { program as Menu } from './menu'
import { program as Calibration } from './calibration'
import { program as Spray } from './spray-can'
import { program as WordPond } from './word-pond'
import { program as Driving } from './driving/'
import { program as PacMan } from './pac-man/'

export const view = (model: TVModel, dispatch: any) => {
  const ctx: TVCtx = model
  let content

  switch (model.screen) {
    case 'menu':
      content = Menu.view(model.menu, dispatch, ctx)
      break
    case 'calibration':
      content = Calibration.view(model.calibration, dispatch, ctx)
      break
    case 'spraycan':
      content = Spray.view(model.spray, dispatch, ctx)
      break
    case 'wordpond':
      content = WordPond.view(model.wordpond, dispatch, ctx)
      break
    case 'pacman':
      content = PacMan.view(model.pacman, dispatch, ctx)
      break
    case 'driving':
      content = Driving.view(model.driving, dispatch, ctx)
      break
    case 'lobby':
    default:
      content = Lobby.view(model.lobby, dispatch, ctx)
  }

  return layout(content, model, dispatch)
}
