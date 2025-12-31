// controller/view.ts
import { m } from '@shared/mithril-lite'
import { createMsg } from '@shared/utils'

import type { ControllerModel, ControllerCtx } from './types'
import type { Payload } from '@shared/types'

import { layout } from './layout'

import { program as Lobby } from './lobby'
import { program as Menu } from './menu'
import { program as Calibration } from './calibration'
import { program as Spray } from './spray-can'
import { program as WordPond } from './word-pond'
import { program as Driving } from './driving'
import { program as PacMan } from './pac-man'

export const view = (
  model: ControllerModel,
  dispatch: (p: Payload) => void
) => {
  let content

  switch (model.screen) {
    case 'menu':
      content = Menu.view(
        model.menu,
        (type: string, data: any = {}) =>
          dispatch(createMsg(type, { ...data, screen: 'menu' })),
        model
      )
      break

    case 'driving':
      content = Driving.view(
        model.driving,
        (type: string, data: any = {}) =>
          dispatch(createMsg(type, { ...data, screen: 'driving' })),
        model
      )
      break

    case 'calibration':
      content = Calibration.view(
        model.calibration,
        (type: string, data: any = {}) =>
          dispatch(createMsg(type, { ...data, screen: 'calibration' })),
        model
      )
      break

    case 'spraycan':
      content = Spray.view(
        model.spray,
        (type: string, data: any = {}) =>
          dispatch(createMsg(type, { ...data, screen: 'spraycan' })),
        model
      )
      break
    case 'pacman':
      content = PacMan.view(
        model.pacman,
        (type: string, data: any = {}) =>
          dispatch(createMsg(type, { ...data, screen: 'pacman' })),
        model
      )
      break
    case 'wordpond':
      content = WordPond.view(
        model.wordpond,
        (type: string, data: any = {}) =>
          dispatch(createMsg(type, { ...data, screen: 'wordpond' })),
        model
      )
      break

    case 'lobby':
    default:
      content = Lobby.view(
        model.lobby,
        (payload: Payload) => {
          return dispatch(
            createMsg(payload.type, { ...payload.msg, screen: 'lobby' })
          )
        },
        model
      )
  }

  return layout(content, model, dispatch)
}
