/** --------------------------------------------------------------------------
 *  Core payload
 *  -------------------------------------------------------------------------- */

export type Payload = {
  type: MessageType | string
  msg: {
    screen?: Screen
    session?: string // shared between TV and controllers
    id?: string // unique participant id
    [k: string]: any // additional data
  }
  t?: number // optional timestamp (ms)
}

/** --------------------------------------------------------------------------
 *  Screens / routes
 *  -------------------------------------------------------------------------- */

export enum Screen {
  LOBBY = 'lobby',
  MENU = 'menu',
  CALIBRATION = 'calibration',
  SPRAYCAN = 'spraycan'
}

/** --------------------------------------------------------------------------
 *  Message types
 *  -------------------------------------------------------------------------- */

export enum MessageType {
  // Relay lifecycle
  RELAY_HELLO = 'RELAY_HELLO',
  RELAY_ACK = 'RELAY_ACK',
  RELAY_ERROR = 'RELAY_ERROR',

  // Session / registration
  REGISTER_TV = 'REGISTER_TV',
  REGISTER_PLAYER = 'REGISTER_PLAYER',
  ACK_TV = 'ACK_TV',
  ACK_PLAYER = 'ACK_PLAYER',

  // Discovery / lobby
  TV_LIST = 'TV_LIST',
  NO_SESSION = 'NO_SESSION',
  NAVIGATE = 'NAVIGATE',
  APP_SELECTED = 'APP_SELECTED',
  // Motion / calibration
  CALIB_UPDATE = 'CALIB_UPDATE',

  // Pointer and hover interactions
  POINTER_HOVER = 'POINTER_HOVER',

  SPRAY_START = 'SPRAY_START', // select color
  SPRAY_POINT = 'SPRAY_POINT', // spray active (continuous)
  SPRAY_END = 'SPRAY_END', // release trigger
  // Gameplay events
  PLAYER_JOINED = 'PLAYER_JOINED',
  PLAYER_LEFT = 'PLAYER_LEFT',

  // Utility
  PING = 'PING',
  PONG = 'PONG'
}

/** --------------------------------------------------------------------------
 *  Common player state
 *  -------------------------------------------------------------------------- */

export enum PlayerStatus {
  IDLE = 'idle',
  CONNECTED = 'connected'
}
// OLD
// export type Payload = {
//   type: MessageType | string
//   msg: {
//     screen?: Screen
//     // include routing and identity here
//     session?: string
//     id?: string
//     [k: string]: any
//   }
//   t?: number
// }
//
// export enum Screen {
//   LOBBY = 'lobby',
//   MENU = 'menu',
//   CALIBRATION = 'calibration',
//   SPRAYCAN = 'spraycan'
// }
//
// export enum MessageType {
//   // relay lifecycle
//   RELAY_HELLO = 'RELAY_HELLO',
//   RELAY_ACK = 'RELAY_ACK',
//   RELAY_ERROR = 'RELAY_ERROR',
//
//   // session / registration
//   REGISTER_TV = 'REGISTER_TV',
//   REGISTER_PLAYER = 'REGISTER_PLAYER',
//   ACK_TV = 'ACK_TV',
//   ACK_PLAYER = 'ACK_PLAYER',
//
//   // controller → tv
//   CALIB_UPDATE = 'CALIB_UPDATE',
//
//   // tv → controller
//   PLAYER_JOINED = 'PLAYER_JOINED',
//   PLAYER_LEFT = 'PLAYER_LEFT',
//
//   // discovery
//   TV_LIST = 'TV_LIST',
//
//   // misc
//   PING = 'PING',
//   PONG = 'PONG',
//   NO_SESSION = 'NO_SESSION'
// }
//
// /** --------------------------------------------------------------------------
//  *  Base message and common fields
//  *  -------------------------------------------------------------------------- */
//
// export interface BaseMessage {
//   type: MessageType
//   /** session identifier (shared between TV and controllers) */
//   session?: string
//   /** unique participant id */
//   id?: string
//   /** optional timestamp for traceability */
//   time?: number
// }
//
// /** --------------------------------------------------------------------------
//  *  Session / registration
//  *  -------------------------------------------------------------------------- */
//
// export interface RegisterTV extends BaseMessage {
//   type: MessageType.REGISTER_TV
//   session: string
// }
//
// export interface RegisterPlayer extends BaseMessage {
//   type: MessageType.REGISTER_PLAYER
//   session: string
//   name: string
// }
//
// export interface AckPlayer extends BaseMessage {
//   type: MessageType.ACK_PLAYER
//   id: string
//   slot: number
// }
//
// /** --------------------------------------------------------------------------
//  *  Navigation / app control
//  *  -------------------------------------------------------------------------- */
//
// export interface AppSelected extends BaseMessage {
//   type: MessageType.APP_SELECTED
//   app: string
// }
//
// export interface Navigate extends BaseMessage {
//   type: MessageType.NAVIGATE
//   to: string
// }
//
// /** --------------------------------------------------------------------------
//  *  Calibration messages
//  *  -------------------------------------------------------------------------- */
//
// export interface CalibUpdate extends BaseMessage {
//   type: MessageType.CALIB_UPDATE
//   alpha: number
//   x: number
//   y: number
// }
//
// export interface CalibDone extends BaseMessage {
//   type: MessageType.CALIB_DONE
// }
//
// /** --------------------------------------------------------------------------
//  *  Spray-can messages
//  *  -------------------------------------------------------------------------- */
//
// export interface SprayStart extends BaseMessage {
//   type: MessageType.SPRAY_START
//   color: string
// }
//
// export interface SprayPoint extends BaseMessage {
//   type: MessageType.SPRAY_POINT
//   x: number
//   y: number
//   pressure: number
// }
//
// export interface SprayEnd extends BaseMessage {
//   type: MessageType.SPRAY_END
// }
//
// /** --------------------------------------------------------------------------
//  *  Network / relay utility messages
//  *  -------------------------------------------------------------------------- */
//
// export interface NetworkIn extends BaseMessage {
//   type: MessageType.NETWORK_IN
//   payload: NetworkMessage // the wrapped message
// }
//
// export interface Ping extends BaseMessage {
//   type: MessageType.PING
// }
//
// export interface Pong extends BaseMessage {
//   type: MessageType.PONG
// }
//
// /** --------------------------------------------------------------------------
//  *  Error / log
//  *  -------------------------------------------------------------------------- */
//
// export interface ErrorMsg extends BaseMessage {
//   type: MessageType.ERROR
//   message: string
// }
//
// export interface LogMsg extends BaseMessage {
//   type: MessageType.LOG
//   message: string
// }
//
// /** --------------------------------------------------------------------------
//  *  Union of every known network message
//  *  -------------------------------------------------------------------------- */
//
// export type NetworkMessage =
//   | RegisterTV
//   | RegisterPlayer
//   | AckPlayer
//   | AppSelected
//   | Navigate
//   | CalibUpdate
//   | CalibDone
//   | SprayStart
//   | SprayPoint
//   | SprayEnd
//   | Ping
//   | Pong
//   | ErrorMsg
//   | LogMsg
//
// /** --------------------------------------------------------------------------
//  *  Full message graph (including relay wrappers)
//  *  -------------------------------------------------------------------------- */
//
// export type AnyMessage = NetworkMessage | NetworkIn
//
// /** --------------------------------------------------------------------------
//  *  Shared enums for common data
//  *  -------------------------------------------------------------------------- */
//
// export enum PlayerStatus {
//   IDLE = 'idle',
//   CONNECTED = 'connected'
// }
//
