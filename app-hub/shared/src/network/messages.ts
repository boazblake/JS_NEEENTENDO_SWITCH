import type { Payload } from '../types'
import { MessageDomain } from '../types'

export type Role = 'TV' | 'CONTROLLER'

export type RegisterMsg = {
  role: Role
  id: string
  session?: string
  name?: string
}

export type AckRegisterMsg = {
  role: Role
  session: string
}

export type RejectMsg = {
  reason:
    | 'INVALID_JSON'
    | 'MISSING_ROLE'
    | 'MISSING_ID'
    | 'MISSING_SESSION'
    | 'NO_SESSION'
    | 'UNKNOWN'
  session?: string
}

export type TvListMsg = {
  list: string[]
}

export const NetworkType = {
  REGISTER: `${MessageDomain.NETWORK}.REGISTER`,
  ACK: `${MessageDomain.NETWORK}.ACK`,
  REJECT: `${MessageDomain.NETWORK}.REJECT`,
  PING: `${MessageDomain.NETWORK}.PING`,
  PONG: `${MessageDomain.NETWORK}.PONG`
} as const

export const LobbyType = {
  TV_LIST: `${MessageDomain.LOBBY}.TV_LIST`
} as const

export type NetworkRegister = Payload<
  (typeof NetworkType)['REGISTER'],
  RegisterMsg
>
export type NetworkAck = Payload<(typeof NetworkType)['ACK'], AckRegisterMsg>
export type NetworkReject = Payload<(typeof NetworkType)['REJECT'], RejectMsg>
export type LobbyTvList = Payload<(typeof LobbyType)['TV_LIST'], TvListMsg>

export type AnyWirePayload = Payload<string, Record<string, unknown>>
