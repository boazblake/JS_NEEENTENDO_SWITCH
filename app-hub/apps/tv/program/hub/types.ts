export type Model = {
  screen: 'menu' | 'spraycan' | 'wordpond'
}

export type Msg =
  | { type: 'SELECT_APP'; app: 'spraycan' | 'wordpond' }
  | { type: 'BACK_TO_MENU' }
