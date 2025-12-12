// tv/env.ts
import type { DomEnv } from 'algebraic-fx'

// Extend DomEnv with WebSocket
export type AppEnv = DomEnv & {
  ws: WebSocket
}
