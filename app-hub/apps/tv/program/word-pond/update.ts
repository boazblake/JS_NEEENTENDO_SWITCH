import { IO, State } from 'algebraic-js'
import type { Model, Msg, Player } from './types.js'
import { sendIO } from '@effects/network'

// `State` holds the entire `players` record
// the computation returns the assigned slot
export const addPlayer = (id: string, name: string) =>
  State<Record<string, Player>, number>((players) => {
    // collect used slots
    const used = new Set(Object.values(players).map((p) => p.slot))
    let slot = 1
    while (used.has(slot)) slot++

    // reuse if the id already exists
    const existing = players[id]
    if (existing) slot = existing.slot

    const player = { id, name, slot }
    const rest = { ...players, [id]: player }
    return [slot, rest]
  })

export const removePlayer = (id: string) =>
  State<Record<string, Player>, void>((players) => {
    const { [id]: _, ...rest } = players
    return [undefined, rest]
  })

export const update = (
  msg: Msg,
  model: Model,
  _dispatch: (m: Msg) => void,
  ws: WebSocket
) => {
  switch (msg.type) {
    case 'NETWORK_IN': {
      const p = JSON.parse(msg.payload)

      if (p?.type === 'UNREGISTER_PLAYER') {
        const [_, players] = removePlayer(p.id).run(model.players)
        return {
          model: { ...model, players },
          effects: [
            sendIO(
              ws,
              JSON.stringify({ type: 'ACK_PLAYER', id: p.id, slot: 0 })
            )
          ]
        }
      }
      if (p?.type === 'REGISTER_PLAYER') {
        const [slot, players] = addPlayer(p.id, p.name).run(model.players)
        const state = { ...model, players }
        return {
          model: state,
          effects: [
            sendIO(ws, JSON.stringify({ type: 'ACK_PLAYER', id: p.id, slot })),
            sendIO(ws, JSON.stringify({ type: 'STATE_SYNC', state }))
          ]
        }
      }
      return { model, effects: [] }
    }

    default:
      return { model, effects: [] }
  }
}
