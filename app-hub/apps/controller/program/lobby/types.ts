export type Model = {
  availableTvs: string[]
  selectedTv: string | null
}

export type Msg =
  | { type: 'SET_TV_LIST'; list: string[] }
  | { type: 'SELECT_TV'; tvId: string }
