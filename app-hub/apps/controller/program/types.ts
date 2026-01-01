import type { Payload } from '@shared/types'

export type Msg = Payload | { type: 'SELECT_TV'; session: string }
