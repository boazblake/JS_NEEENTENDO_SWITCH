import type { DomEnv } from 'algebraic-fx'

// Extend DomEnv with WebSocket
export type TVEnv = DomEnv & {
  ws: WebSocket
}
