// tv/env.ts
import type { DomEnv } from 'algebraic-fx' // EXACT IMPORT PER DOCS

// Extend DomEnv with WebSocket
export type TVEnv = DomEnv & {
  ws: WebSocket
}
