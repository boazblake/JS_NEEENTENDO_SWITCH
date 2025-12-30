import type { DomEnv, Dispatch } from 'algebraic-fx'

// Extend DomEnv with WebSocket
export type TVEnv = DomEnv & {
  makeWebSocket: (url: string) => new WebSocket(url),
}
