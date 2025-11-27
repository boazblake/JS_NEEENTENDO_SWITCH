import { m } from '@shared/mithril-lite'
import { Screen } from '@shared/types'
import { createMsg } from '@shared/utils'
import type { Model } from './types'
import type { Payload } from '@shared/types'
import { program as Lobby } from './lobby/index'
import { program as Menu } from './menu/index'
import { program as Calibration } from './calibration/index'
import { program as Spray } from './spray-can/index'

export const view = (model: Model, dispatch: (p: Payload) => void) => {
  switch (model.screen) {
    case Screen.LOBBY:
      return Lobby.view(model.lobby, (type: string, data: any = {}) =>
        dispatch(createMsg(type, { ...data, screen: Screen.LOBBY }))
      )
    case Screen.MENU:
      return Menu.view(model, (type: string, data: any = {}) =>
        dispatch(createMsg(type, { ...data, screen: Screen.MENU }))
      )
    case Screen.CALIBRATION:
      return Calibration.view(model, (type: string, data: any = {}) =>
        dispatch(createMsg(type, { ...data, screen: Screen.CALIBRATION }))
      )
    case Screen.SPRAYCAN:
      return Spray.view(model, (type: string, data: any = {}) =>
        dispatch(createMsg(type, { ...data, screen: Screen.SPRAYCAN }))
      )
    default:
      return m('div', 'Loading…')
  }
}
