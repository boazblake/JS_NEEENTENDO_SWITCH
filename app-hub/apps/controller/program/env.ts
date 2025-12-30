import type { DomEnv } from 'algebraic-fx'

export type ControllerEnv = DomEnv & {
  id: string
  session: string
  makeWebSocket: (url: string) => WebSocket
}
