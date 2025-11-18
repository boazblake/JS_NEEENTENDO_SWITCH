import { Stream, Reader, IO, type DomEnv } from 'algebraic-js'
import type { Msg } from '../types.js'
import { sendIO } from './network.ts'

/**
 * Registers a resize event listener and dispatches RESIZE messages.
 * Returns an IO cleanup function.
 */
export const registerResizeIO = (dispatch: (msg: Msg) => void) =>
  Reader<DomEnv, IO<() => void>>((env) =>
    IO(() => {
      const resize = () =>
        dispatch({
          type: 'RESIZE',
          width: env.window.innerWidth,
          height: env.window.innerHeight
        })

      env.window.addEventListener('resize', resize)
      resize() // emit immediately on mount

      return () => env.window.removeEventListener('resize', resize)
    })
  )

/**
 * Creates a periodic IO that sends the current model to all clients.
 * The stream emits once every `ms` milliseconds.
 */

export const broadcastState = (ws, getState, ms = 2000) => {
  const s = Stream.interval(ms)
  const unsub = s.subscribe({
    next: () => {
      const state = getState()
      console.log(JSON.stringify({ type: 'STATE_SYNC', state }))
      sendIO(ws, JSON.stringify({ type: 'STATE_SYNC', state })).run()
    },
    error: (e) => console.error('[broadcastState]', e)
  })
  return IO(() => unsub) // returning IO allows runtime to cancel it later
}
