/** --------------------------------------------------------------------------
 *  Message identifiers shared across all runtime participants:
 *  Relay ↔ TV ↔ Controller
 *  -------------------------------------------------------------------------- */

/** --------------------------------------------------------------------------
 *  Message envelopes for composition
 *  -------------------------------------------------------------------------- */

/** Outer envelope used by Relay to wrap network traffic. */
export interface NetworkIn {
  type: MessageType.NETWORK_IN
  payload: NetworkMessage
}

/** Optional inner envelope for sub-program communication. */
export interface ScreenIn {
  type: MessageType.SCREEN_IN
  screen: Screen
  payload: any
}

/** Optional reverse envelope if sub-program sends upward. */
export interface ScreenOut {
  type: MessageType.SCREEN_OUT
  screen: Screen
  payload: any
}

export enum MessageType {
  // General network plumbing
  NETWORK_IN = 'NETWORK_IN',
  PING = 'PING',
  PONG = 'PONG',
  NO_SESSION = 'NO_SESSION',

  // Session and registration
  REGISTER_TV = 'REGISTER_TV',
  TV_LIST = 'TV_LIST',
  REGISTER_PLAYER = 'REGISTER_PLAYER',
  ACK_PLAYER = 'ACK_PLAYER',

  // Navigation and app control
  APP_SELECTED = 'APP_SELECTED',
  SELECT_APP = 'SELECT_APP',
  NAVIGATE = 'NAVIGATE',
  BACK_TO_MENU = 'BACK_TO_MENU',
  SCREEN_IN = 'SCREEN_IN',
  SCREEN_OUT = 'SCREEN_OUT',

  // Calibration
  CALIB_UPDATE = 'CALIB_UPDATE',
  CALIB_DONE = 'CALIB_DONE',

  // Spray-can gameplay
  SPRAY_START = 'SPRAY_START',
  SPRAY_POINT = 'SPRAY_POINT',
  SPRAY_END = 'SPRAY_END',

  // Future / misc system events
  ERROR = 'ERROR',
  LOG = 'LOG'
}

/** --------------------------------------------------------------------------
 *  Base message and common fields
 *  -------------------------------------------------------------------------- */

export interface BaseMessage {
  type: MessageType
  /** session identifier (shared between TV and controllers) */
  session?: string
  /** unique participant id */
  id?: string
  /** optional timestamp for traceability */
  time?: number
}

/** --------------------------------------------------------------------------
 *  Session / registration
 *  -------------------------------------------------------------------------- */

export interface RegisterTV extends BaseMessage {
  type: MessageType.REGISTER_TV
  session: string
}

export interface RegisterPlayer extends BaseMessage {
  type: MessageType.REGISTER_PLAYER
  session: string
  name: string
}

export interface AckPlayer extends BaseMessage {
  type: MessageType.ACK_PLAYER
  id: string
  slot: number
}

/** --------------------------------------------------------------------------
 *  Navigation / app control
 *  -------------------------------------------------------------------------- */

export interface AppSelected extends BaseMessage {
  type: MessageType.APP_SELECTED
  app: string
}

export interface Navigate extends BaseMessage {
  type: MessageType.NAVIGATE
  to: string
}

/** --------------------------------------------------------------------------
 *  Calibration messages
 *  -------------------------------------------------------------------------- */

export interface CalibUpdate extends BaseMessage {
  type: MessageType.CALIB_UPDATE
  alpha: number
  x: number
  y: number
}

export interface CalibDone extends BaseMessage {
  type: MessageType.CALIB_DONE
}

/** --------------------------------------------------------------------------
 *  Spray-can messages
 *  -------------------------------------------------------------------------- */

export interface SprayStart extends BaseMessage {
  type: MessageType.SPRAY_START
  color: string
}

export interface SprayPoint extends BaseMessage {
  type: MessageType.SPRAY_POINT
  x: number
  y: number
  pressure: number
}

export interface SprayEnd extends BaseMessage {
  type: MessageType.SPRAY_END
}

/** --------------------------------------------------------------------------
 *  Network / relay utility messages
 *  -------------------------------------------------------------------------- */

export interface NetworkIn extends BaseMessage {
  type: MessageType.NETWORK_IN
  payload: NetworkMessage // the wrapped message
}

export interface Ping extends BaseMessage {
  type: MessageType.PING
}

export interface Pong extends BaseMessage {
  type: MessageType.PONG
}

/** --------------------------------------------------------------------------
 *  Error / log
 *  -------------------------------------------------------------------------- */

export interface ErrorMsg extends BaseMessage {
  type: MessageType.ERROR
  message: string
}

export interface LogMsg extends BaseMessage {
  type: MessageType.LOG
  message: string
}

/** --------------------------------------------------------------------------
 *  Union of every known network message
 *  -------------------------------------------------------------------------- */

export type NetworkMessage =
  | RegisterTV
  | RegisterPlayer
  | AckPlayer
  | AppSelected
  | Navigate
  | CalibUpdate
  | CalibDone
  | SprayStart
  | SprayPoint
  | SprayEnd
  | Ping
  | Pong
  | ErrorMsg
  | LogMsg

/** --------------------------------------------------------------------------
 *  Full message graph (including relay wrappers)
 *  -------------------------------------------------------------------------- */

export type AnyMessage = NetworkMessage | NetworkIn

/** --------------------------------------------------------------------------
 *  Shared enums for common data
 *  -------------------------------------------------------------------------- */

export enum Screen {
  LOBBY = 'lobby',
  MENU = 'menu',
  CALIBRATION = 'calibration',
  SPRAYCAN = 'spraycan'
}

export enum PlayerStatus {
  IDLE = 'idle',
  CONNECTED = 'connected'
}
