import { layout } from './layout'
import { makeTVContext } from './context'
import type { TVModel, TVMsg } from './types'

// import { program as Lobby } from './lobby'
import { program as Menu } from './menu'
// import { program as Calibration } from './calibration'
// import { program as Spray } from './spray-can'
// import { program as WordPond } from './word-pond'
// import { program as Driving } from './driving'
// import { program as PacMan } from './pac-man'

export const view = (model: TVModel, dispatch: (msg: TVMsg) => void) => {
  const ctx = makeTVContext(model)

  let content

  switch (model.screen) {
    case 'calibration':
      content = model.calibration
        ? Calibration.view(model.calibration, dispatch, ctx)
        : Menu.view(model.lobby, dispatch, ctx)
      break
    case 'spraycan':
      content = model.spray
        ? Spray.view(model.spray, dispatch, ctx)
        : Menu.view(model.lobby, dispatch, ctx)
      break
    case 'wordpond':
      content = model.wordpond
        ? WordPond.view(model.wordpond, dispatch, ctx)
        : Menu.view(model.lobby, dispatch, ctx)
      break
    case 'pacman':
      content = model.pacman
        ? PacMan.view(model.pacman, dispatch, ctx)
        : Menu.view(model.lobby, dispatch, ctx)
      break
    case 'driving':
      content = model.driving
        ? Driving.view(model.driving, dispatch, ctx)
        : Menu.view(model.lobby, dispatch, ctx)
      break
    case 'menu':
    default:
      content = Menu.view(model.lobby, dispatch, ctx)
  }

  return layout(content, model, dispatch)
}
