import { MessageType } from '@shared/types'
import type { NetworkModel, NetworkMsg } from './network'

export type Screen = 'menu' | 'paired'

export type Model = {
  screen: Screen
  tvList: string[]
  session: string | null
  network: NetworkModel
}

export type Msg =
  | { type: 'Network'; msg: NetworkMsg }
  | { type: MessageType.TV_LIST; msg: { list: string[] } }
  | { type: 'SelectTV'; session: string }
  | { type: MessageType.ACK_PLAYER }
