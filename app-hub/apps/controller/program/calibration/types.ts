export type Model = {
  quaternion: [number, number, number, number]
  gravity: [number, number, number]
}

export type Msg =
  | {
      type: 'MOTION'
      quaternion: [number, number, number, number]
      gravity: [number, number, number]
    }
  | { type: 'NETWORK_IN'; payload: any }
