/** --------------------------------------------------------------------------
 *  Core payload
 *  -------------------------------------------------------------------------- */

export type Payload<
  TType extends string = string,
  TMsg extends Record<string, any> = Record<string, any>
> = {
  type: TType
  msg: TMsg
  t?: number // optional timestamp (ms)
}

/** --------------------------------------------------------------------------
 *  Screens / routes
 *  -------------------------------------------------------------------------- */

export enum Screen {
  LOBBY = 'lobby',
  MENU = 'menu',
  CALIBRATION = 'calibration',
  SPRAYCAN = 'spraycan',
  WORDPOND = 'wordpond'
}

/** --------------------------------------------------------------------------
 *  System & session message types (namespaced)
 *  -------------------------------------------------------------------------- */

export enum MessageType {
  // Relay lifecycle
  RELAY_HELLO = 'system.relay.hello',
  RELAY_ACK = 'system.relay.ack',
  RELAY_ERROR = 'system.relay.error',

  // Session / registration
  REGISTER_TV = 'session.register.tv',
  REGISTER_PLAYER = 'session.register.player',
  ACK_TV = 'session.ack.tv',
  ACK_PLAYER = 'session.ack.player',

  // Discovery / lobby
  TV_LIST = 'lobby.tv-list',
  NO_SESSION = 'session.no-session',

  // Navigation / screen selection
  NAVIGATE = 'ui.navigate',
  SCREEN_SELECTED = 'ui.screen-selected',

  // Motion / calibration
  CALIB_UPDATE = 'motion.calibration-update',

  // Pointer and hover interactions
  POINTER_HOVER = 'pointer.hover',
  POINTER_CLICKED = 'pointer.clicked',

  // Spray-can gameplay
  SPRAY_START = 'spray.start',
  SPRAY_POINT = 'spray.point',
  SPRAY_END = 'spray.end',

  // Gameplay events
  PLAYER_JOINED = 'session.player-joined',
  PLAYER_LEFT = 'session.player-left',

  // Utility
  PING = 'system.ping',
  PONG = 'system.pong'
}

/** --------------------------------------------------------------------------
 *  Word-Pond cross-device message namespace (namespaced strings)
 *  -------------------------------------------------------------------------- */

export const WordPondMsg = {
  NET_UPDATE: 'wordpond.net' as const, // controller → tv
  SHAKE: 'wordpond.shake' as const, // controller → tv
  STATE: 'wordpond.state' as const // tv → controller
}

export type WordPondMsgType =
  | (typeof WordPondMsg)['NET_UPDATE']
  | (typeof WordPondMsg)['SHAKE']
  | (typeof WordPondMsg)['STATE']

/** --------------------------------------------------------------------------
 *  Canonical Word-Pond payloads (still fit Payload shape)
 *  -------------------------------------------------------------------------- */

export type WordPondNetUpdate = Payload<
  (typeof WordPondMsg)['NET_UPDATE'],
  {
    screen: Screen.WORDPOND
    session: string
    id: string // controller id
    x: number // normalized 0..1
    y: number // normalized 0..1
  }
>

export type WordPondShake = Payload<
  (typeof WordPondMsg)['SHAKE'],
  {
    screen: Screen.WORDPOND
    session: string
    id: string // controller id
  }
>

export type WordPondStatePayload = Payload<
  (typeof WordPondMsg)['STATE'],
  {
    screen: Screen.WORDPOND
    session: string
    state: WordPondState
  }
>

export type WordPondPayload =
  | WordPondNetUpdate
  | WordPondShake
  | WordPondStatePayload

/** --------------------------------------------------------------------------
 *  Shared game-state model for Word-Pond (TV + controllers)
 *  -------------------------------------------------------------------------- */

export type Letter = {
  id: string
  char: string
  x: number
  y: number
  vx: number
  vy: number
  caughtBy: string | null // player id
}

export type Pond = {
  id: string // player id
  letters: string[]
}

export type Net = {
  id: string // player id
  x: number
  y: number
}

export type WordPondState = {
  players: string[]
  letters: Letter[]
  nets: Record<string, Net>
  ponds: Record<string, Pond>
  targetWord: string
}

/** --------------------------------------------------------------------------
 *  Global color palette shared by apps
 *  -------------------------------------------------------------------------- */

export const COLORS: { color: string; hex: string }[] = [
  { color: 'red', hex: '#ef4444' },
  { color: 'orange', hex: '#f97316' },
  { color: 'yellow', hex: '#eab308' },
  { color: 'green', hex: '#22c55e' },
  { color: 'teal', hex: '#14b8a6' },
  { color: 'blue', hex: '#3b82f6' },
  { color: 'purple', hex: '#8b5cf6' },
  { color: 'pink', hex: '#ec4899' }
]

/** --------------------------------------------------------------------------
 *  Common player state
 *  -------------------------------------------------------------------------- */

export enum PlayerStatus {
  IDLE = 'idle',
  CONNECTED = 'connected'
}

/** --------------------------------------------------------------------------
 *  Root network union (optional, if you want one place to type all WS msgs)
 *  -------------------------------------------------------------------------- */

// All cross-device messages that actually travel over the relay.
// Extend this union as you add more app-level namespaced messages.
export type NetworkMessage =
  // System / relay / session / navigation
  | Payload<MessageType.RELAY_HELLO, any>
  | Payload<MessageType.RELAY_ACK, any>
  | Payload<MessageType.RELAY_ERROR, any>
  | Payload<MessageType.REGISTER_TV, any>
  | Payload<MessageType.REGISTER_PLAYER, any>
  | Payload<MessageType.ACK_TV, any>
  | Payload<MessageType.ACK_PLAYER, any>
  | Payload<MessageType.TV_LIST, any>
  | Payload<MessageType.NO_SESSION, any>
  | Payload<MessageType.NAVIGATE, any>
  | Payload<MessageType.SCREEN_SELECTED, any>
  | Payload<MessageType.CALIB_UPDATE, any>
  | Payload<MessageType.POINTER_HOVER, any>
  | Payload<MessageType.POINTER_CLICKED, any>
  | Payload<MessageType.SPRAY_START, any>
  | Payload<MessageType.SPRAY_POINT, any>
  | Payload<MessageType.SPRAY_END, any>
  | Payload<MessageType.PLAYER_JOINED, any>
  | Payload<MessageType.PLAYER_LEFT, any>
  | Payload<MessageType.PING, any>
  | Payload<MessageType.PONG, any>
  // Word-Pond cross-device messages
  | WordPondNetUpdate
  | WordPondShake
  | WordPondStatePayload

// If you still want a very loose "anything WS" type for the server, keep:
export type AnyPayload = Payload<string, Record<string, any>>
