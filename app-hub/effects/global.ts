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
          msg: { width: env.window.innerWidth, height: env.window.innerHeight }
        })

      env.window.addEventListener('resize', resize)
      resize() // emit immediately on mount

      return () => env.window.removeEventListener('resize', resize)
    })
  )

/**
 * Tracks `[data-action]` elements and dispatches their bounding rects.
 * Relies on your existing resize IO to trigger on window size changes.
 */
export const registerActionsIO = (dispatch: (msg: Msg) => void) =>
  Reader<DomEnv, IO<() => void>>((env) =>
    IO(() => {
      const { document, window } = env

      const collect = () => {
        const nodes = Array.from(
          document.querySelectorAll<HTMLElement>('[data-action]')
        )
        const actions = nodes.map((el) => {
          const r = el.getBoundingClientRect()
          return {
            id: el.dataset.action || '',
            rect: { x: r.left, y: r.top, w: r.width, h: r.height }
          }
        })
        dispatch({ type: 'ACTIONS_REGISTERED', msg: { actions } } as any)
      }

      // Observe DOM mutations (add/remove or attribute changes)
      const mo = new window.MutationObserver(() => collect())
      mo.observe(document.body, {
        subtree: true,
        childList: true,
        attributes: true,
        attributeFilter: ['data-action', 'class', 'style']
      })

      // Initial pass
      collect()

      // Cleanup
      return () => mo.disconnect()
    })
  )
