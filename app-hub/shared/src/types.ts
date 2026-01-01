/** --------------------------------------------------------------------------
 *  Core payload (single wire shape)
 *  -------------------------------------------------------------------------- */

export type Payload<
  TType extends string = string,
  TMsg extends Record<string, unknown> = Record<string, unknown>
> = {
  type: TType
  msg: TMsg
  t: number
}

/** --------------------------------------------------------------------------
 *  Roles
 *  -------------------------------------------------------------------------- */

export enum Role {
  TV = 'TV',
  CONTROLLER = 'CONTROLLER'
}

/** --------------------------------------------------------------------------
 *  Screens / routes
 *  -------------------------------------------------------------------------- */

export enum Screen {
  LOBBY = 'LOBBY',
  MENU = 'MENU',
  CALIBRATION = 'CALIBRATION',
  SPRAYCAN = 'SPRAYCAN',
  WORDPOND = 'WORDPOND',
  PACMAN = 'PACMAN',
  DRIVING = 'DRIVING'
}

/** --------------------------------------------------------------------------
 *  Network message types (UPPER_SNAKE)
 *  -------------------------------------------------------------------------- */

export enum MessageType {
  // Relay lifecycle
  RELAY_HELLO = 'RELAY_HELLO',
  RELAY_ERROR = 'RELAY_ERROR',

  // Discovery
  TV_LIST = 'TV_LIST',

  // Registration / session
  REGISTER = 'REGISTER',
  REGISTERED = 'REGISTERED',
  REJECTED = 'REJECTED',

  // Session events
  PLAYER_JOINED = 'PLAYER_JOINED',
  PLAYER_LEFT = 'PLAYER_LEFT',

  // Navigation
  NAVIGATE = 'NAVIGATE',

  // Utility
  PING = 'PING',
  PONG = 'PONG',

  // Motion / calibration
  CALIB_UPDATE = 'CALIB_UPDATE',

  // Spray
  SPRAY_START = 'SPRAY_START',
  SPRAY_POINT = 'SPRAY_POINT',
  SPRAY_END = 'SPRAY_END'
}

/** --------------------------------------------------------------------------
 *  Canonical network payloads (typed)
 *  -------------------------------------------------------------------------- */

export type RelayHello = Payload<
  MessageType.RELAY_HELLO,
  {
    message: string
  }
>

export type RelayError = Payload<
  MessageType.RELAY_ERROR,
  {
    reason: string
  }
>

export type TVList = Payload<
  MessageType.TV_LIST,
  {
    list: string[]
  }
>

export type Register = Payload<
  MessageType.REGISTER,
  {
    role: Role
    id: string
    session?: string
    name?: string
  }
>

export type Registered = Payload<
  MessageType.REGISTERED,
  {
    role: Role
    id: string
    session: string
  }
>

export type Rejected = Payload<
  MessageType.REJECTED,
  {
    role: Role
    id?: string
    reason: string
    session?: string
  }
>

export type PlayerJoined = Payload<
  MessageType.PLAYER_JOINED,
  {
    session: string
    id: string
    name: string
  }
>

export type PlayerLeft = Payload<
  MessageType.PLAYER_LEFT,
  {
    session: string
    id?: string
    reason?: string
  }
>

export type Navigate = Payload<
  MessageType.NAVIGATE,
  {
    session: string
    screen: Screen
  }
>

export type Ping = Payload<MessageType.PING, {}>
export type Pong = Payload<MessageType.PONG, {}>

/** --------------------------------------------------------------------------
 *  WordPond namespace (keep, but UPPER_SNAKE keys)
 *  -------------------------------------------------------------------------- */

export enum WordPondType {
  WORDPOND_NET_UPDATE = 'WORDPOND_NET_UPDATE',
  WORDPOND_SHAKE = 'WORDPOND_SHAKE',
  WORDPOND_STATE = 'WORDPOND_STATE'
}

export type Letter = {
  id: string
  char: string
  x: number
  y: number
  vx: number
  vy: number
  caughtBy: string | null
}

export type Pond = {
  id: string
  letters: string[]
}

export type Net = {
  id: string
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

export type WordPondNetUpdate = Payload<
  WordPondType.WORDPOND_NET_UPDATE,
  {
    screen: Screen.WORDPOND
    session: string
    id: string
    x: number
    y: number
  }
>

export type WordPondShake = Payload<
  WordPondType.WORDPOND_SHAKE,
  {
    screen: Screen.WORDPOND
    session: string
    id: string
  }
>

export type WordPondStatePayload = Payload<
  WordPondType.WORDPOND_STATE,
  {
    screen: Screen.WORDPOND
    session: string
    state: WordPondState
  }
>

export type NetworkMessage =
  | RelayHello
  | RelayError
  | TVList
  | Register
  | Registered
  | Rejected
  | PlayerJoined
  | PlayerLeft
  | Navigate
  | Ping
  | Pong
  | WordPondNetUpdate
  | WordPondShake
  | WordPondStatePayload

export type AnyPayload = Payload<string, Record<string, unknown>>

/** --------------------------------------------------------------------------
 *  Global color palette shared by apps (UI only)
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
 *  WordPond compatibility aliases (TEMPORARY)
 *  -------------------------------------------------------------------------- */

export const WordPondMsg = {
  NET_UPDATE: WordPondType.WORDPOND_NET_UPDATE,
  SHAKE: WordPondType.WORDPOND_SHAKE,
  STATE: WordPondType.WORDPOND_STATE
} as const

export type WordPondMsgType =
  | (typeof WordPondMsg)['NET_UPDATE']
  | (typeof WordPondMsg)['SHAKE']
  | (typeof WordPondMsg)['STATE']

/** --------------------------------------------------------------------------
 *  Message routing domains
 *  -------------------------------------------------------------------------- */

export enum MessageDomain {
  NETWORK = 'NETWORK',
  LOBBY = 'LOBBY',
  GAME = 'GAME'
}

/**
 * A routed message type is a dot-delimited path.
 * The first segment MUST be a MessageDomain.
 *
 * Examples:
 *  - NETWORK.REGISTER
 *  - LOBBY.SET_TV_LIST
 *  - GAME.WORDPOND.NET_UPDATE
 */
export type RoutedType = `${MessageDomain}.${string}`

/** --------------------------------------------------------------------------
 *  Canonical payload (unchanged shape)
 *  -------------------------------------------------------------------------- */

export type Payload<
  TType extends string = RoutedType,
  TMsg extends Record<string, unknown> = Record<string, unknown>
> = {
  type: TType
  msg: TMsg
  t: number
}
