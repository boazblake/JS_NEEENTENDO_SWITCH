import { MessageType } from '@shared/types'

export type Marker = { id: string; x: number; y: number; alpha?: number }

export type Model = {
  markers: Record<string, Marker>
  flipPY: boolean
}

export type NetworkIn = {
  type: MessageType.NETWORK_IN
  payload: any
}

export type Msg = NetworkIn
