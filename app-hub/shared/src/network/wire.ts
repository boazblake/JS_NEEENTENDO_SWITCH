export type WireMsg =
  | {
      type: 'TV_LIST'
      msg: {
        list: Array<{
          id: string
          name: string
        }>
      }
    }
  | {
      type: 'RELAY'
      msg: unknown
    }
