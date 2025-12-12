// tv/effects/global.ts
import type { RawEffect, Effect } from 'algebraic-fx'
import type { TVEnv } from '../program/env'
import type { TVMsg } from '../program/types'

// -----------------------------------------------------
// RESIZE EFFECT
// -----------------------------------------------------
export const resizeEffect: Effect<TVEnv, TVMsg> = {
  run(env, dispatch) {
    const handler = () =>
      dispatch({
        type: 'RESIZE',
        msg: {
          width: env.window.innerWidth,
          height: env.window.innerHeight
        }
      })

    env.window.addEventListener('resize', handler)
    handler()

    return () => env.window.removeEventListener('resize', handler)
  }
}

// -----------------------------------------------------
// ACTIONS EFFECT
// -----------------------------------------------------
export const actionsEffect: Effect<TVEnv, TVMsg> = {
  run(env, dispatch) {
    const collect = () => {
      const nodes = Array.from(
        env.document.querySelectorAll('[data-action]')
      ) as HTMLElement[]

      const actions = nodes.map((el) => {
        const r = el.getBoundingClientRect()
        return {
          id: el.dataset.action || '',
          rect: { x: r.left, y: r.top, w: r.width, h: r.height }
        }
      })

      dispatch({
        type: 'ACTIONS_REGISTERED',
        msg: { actions }
      })
    }

    const mo = new env.window.MutationObserver(() => collect())

    mo.observe(env.document.body, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['data-action', 'class', 'style']
    })

    collect()

    return () => mo.disconnect()
  }
}
