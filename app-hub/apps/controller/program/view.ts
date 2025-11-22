import { div } from '@shared/renderer'
import type { Model, Msg } from './types.js'
import { Screen } from '@shared/types'
import { program as Lobby } from './lobby/index.js'
import { program as Menu } from './menu/index.js'
import { program as Calibration } from './calibration/index.js'
import { program as Spray } from './spray-can/index.js'

export const view = (model: Model, dispatch: (m: Msg) => void) => {
  switch (model.screen) {
    case Screen.LOBBY:
      return Lobby.view(model.lobby, (m) =>
        dispatch({ type: Screen.LOBBY, msg: m })
      )
    case Screen.MENU:
      return Menu.view(model.menu, (m) =>
        dispatch({ type: Screen.MENU, msg: m })
      )
    case Screen.CALIBRATION:
      return Calibration.view(model.calibration, (m) =>
        dispatch({ type: Screen.CALIBRATION, msg: m })
      )
    case Screen.SPRAYCAN:
      return Spray.view(model.spray, (m) =>
        dispatch({ type: Screen.SPRAYCAN, msg: m })
      )
    default:
      return div({}, 'Loading…')
  }
}
