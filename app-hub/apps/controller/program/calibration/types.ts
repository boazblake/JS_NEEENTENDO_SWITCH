export type Model = {
  quaternion: [number, number, number, number]
  gravity: [number, number, number]
  rotation: [number, number, number]
  timestamp: number
}

export type Msg =
  | {
      type: 'MOTION'
      quaternion: [number, number, number, number]
      gravity: [number, number, number]
      rotation: [number, number, number]
      timestamp: number
    }
  | { type: 'NETWORK_IN'; payload: any }
