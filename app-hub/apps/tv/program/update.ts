import type { RawEffect, Dispatch } from 'algebraic-fx'
import { MessageType, WordPondMsg, type Payload } from '@shared/types'
import type { WireMsg } from '@shared/protocol'
import type { TVEnv } from './env'
import type { TVModel, TVContext, TVMsg } from './types'
import * as Network from './network'
import { splitRoute } from '@shared/utils'
import { routeByDomain } from '@shared/router'
import { MessageDomain } from '@shared/types'
import { orientationToXY } from './effects'

import { program as Lobby } from './lobby'
import { program as Menu } from './menu'
import { program as Calibration } from './calibration'
import { program as Spray } from './spray-can'
import { program as WordPond } from './word-pond'
import { program as PacMan } from './pac-man'
import { program as Driving } from './driving'

/* -------------------------------------------------- */
/* helpers                                            */
/* -------------------------------------------------- */

const dispatchEffect = (
  msg: TVMsg,
  dispatch: Dispatch
): RawEffect<TVEnv, TVMsg> => ({
  run: (_env) => dispatch(msg)
})

const wireToPayload = (wire: WireMsg): Payload => ({
  type: wire.type as any,
  msg: wire.msg as any
})

const makeCtx = (model: TVModel): TVContext => ({
  session: model.session,
  screenW: model.screenW,
  screenH: model.screenH,
  controllers: model.controllers,
  actions: model.actions,
  players: model.players
})

/* -------------------------------------------------- */
/* update                                             */
/* -------------------------------------------------- */

export const update = (msg: TVMsg, model: TVModel, dispatch: Dispatch) => {
  console.log(msg, model)
  /* ---------- network wrapper ---------- */

  if (msg.type === 'Network') {
    const net = msg.msg

    if (net.type === 'Inbound') {
      return {
        model,
        effects: [dispatchEffect(wireToPayload(net.msg), dispatch)]
      }
    }

    const next = Network.update(net, model.network)
    return {
      model: { ...model, network: next.model },
      effects: next.effects
    }
  }

  if (msg.type === 'Shutdown') {
    return {
      model: { ...model, network: { status: 'off' } },
      effects: []
    }
  }

  const payload = msg as Payload
  const ctx = makeCtx(model)
  /* ---------- payload ---------- */
  return routeByDomain(payload, model, {
    [MessageDomain.NETWORK]: (p, m) => {
      console.log('this', p, m)
      const r = Network.update(p, m.network, dispatch)
      return { model: { ...m, network: r.model }, effects: r.effects }
    },

    [MessageDomain.LOBBY]: (p, m) => {
      const r = Lobby.update(p, m.lobby, dispatch)
      return { model: { ...m, lobby: r.model }, effects: r.effects }
    },

    [MessageDomain.CALIBRATION]: (p, m) => {
      const r = Calibration.update(p, m.calibration, dispatch, model)
      return {
        model: { ...m, calibration: r.model },
        effects: r.effects
      }
    }
  })

  // const { domain, type } = splitRoute(payload.type)
  // console.log(domain, type, payload.msg)
  //
  // /* ---------- TV lobby routing ---------- */
  //
  // if (domain === MessageDomain.LOBBY) {
  //   const r = Lobby.update(payload, model.lobby)
  //   return {
  //     model: { ...model, lobby: r.model },
  //     effects: r.effects
  //   }
  // }
  //
  // /* ---------- Calibration routing (GAME domain) ---------- */
  //
  // if (domain === MessageDomain.CALIBRATION && model.calibration) {
  //   const r = Calibration.update(payload, model.calibration, ctx)
  //   return {
  //     model: { ...model, calibration: r.model },
  //     effects: r.effects
  //   }
  // }

  /* ---------- legacy root handling (unchanged) ---------- */

  switch (payload.type) {
    case MessageType.RELAY_HELLO:
      return { model, effects: [] }

    case MessageType.NAVIGATE: {
      const screen = payload.msg.screen as TVModel['screen']
      return {
        model: { ...model, screen },
        effects: []
      }
    }

    case 'ACTIONS_REGISTERED':
      return {
        model: { ...model, actions: payload.msg.actions || [] },
        effects: []
      }

    case MessageType.PLAYER_JOINED: {
      const players = [
        ...model.players,
        {
          id: payload.msg.id || '',
          name: payload.msg.name || 'Player',
          slot: payload.msg.slot ?? model.players.length
        }
      ]

      const screen: TVModel['screen'] =
        players.length === 1 ? 'menu' : model.screen

      return {
        model: { ...model, players, screen },
        effects: []
      }
    }

    case 'RESIZE':
      return {
        model: {
          ...model,
          screenW: payload.msg.width,
          screenH: payload.msg.height
        },
        effects: []
      }

    case MessageType.SPRAY_POINT:
    case WordPondMsg.NET_UPDATE:
    case WordPondMsg.SHAKE: {
      if (!model.wordpond) return { model, effects: [] }
      const r = WordPond.update(payload, model.wordpond, ctx)
      return { model: { ...model, wordpond: r.model }, effects: r.effects }
    }

    default:
      return { model, effects: [] }
  }
}
