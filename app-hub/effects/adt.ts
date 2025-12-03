import { IO } from 'algebraic-fx'

/* --------------------------------------------
   Base algebraic effects
-------------------------------------------- */

/** Semantic wrapper for network outbound messages. */
export type NetworkOut = { type: 'NetworkOut'; msg: any }

/** Helper constructor */
export const NetworkOut = (msg: any): NetworkOut => ({
  type: 'NetworkOut',
  msg
})

/** Log for debug purposes (executed as IO at parent level). */
export type LogEffect = { type: 'Log'; message: string }
export const LogEffect = (message: string): LogEffect => ({
  type: 'Log',
  message
})

/** Union of all custom effects returned by programs. */
export type AppEffect = NetworkOut | LogEffect

/** Interpreter: run effects at parent level. */
export const interpretEffects = (
  effects: AppEffect[],
  ws: WebSocket
): IO<void>[] => {
  const ios: IO<void>[] = []
  for (const e of effects) {
    switch (e.type) {
      case 'NetworkOut':
        ios.push(IO(() => ws.send(JSON.stringify(e.msg))))
        break
      case 'Log':
        ios.push(IO(() => console.log('[Log]', e.message)))
        break
      default:
        break
    }
  }
  return ios
}
