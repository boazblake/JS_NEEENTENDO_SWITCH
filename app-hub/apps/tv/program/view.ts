import { layout } from './layout.js'
import { view as lobbyView } from './lobby/view.js'
import { view as menuView } from './menu/view.js'
import { view as calibrationView } from './calibration/view.js'
import { view as sprayView } from './spray-can/view.js'
import type { Model } from './types.js'

export const view = (model: Model, dispatch: any) => {
  let content

  switch (model.screen) {
    case 'menu':
      content = menuView(model, dispatch)
      break

    case 'calibration':
      content = calibrationView(model, dispatch)
      break

    case 'spraycan':
      content = sprayView(model, dispatch)
      break

    case 'lobby':
    default:
      content = lobbyView(model, dispatch)
  }

  return layout(content, model, dispatch)
}
