import { MessageType } from '@shared/types'


export type Model = {
  markers: Record<string, Marker>
  flipPY: boolean
}

export type NetworkIn = {
  type: MessageType.NETWORK_IN
  payload: any
}

export type Msg = NetworkIn
