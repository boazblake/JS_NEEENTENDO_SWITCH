import { IO } from 'algebraic-fx'
import { encode } from '@shared/protocol'
import type { NetworkMsg } from './types'
import type { TVEnv } from '../env'

export const send = (wire: NetworkMsg & { type: 'Send' }) =>
  IO.IO<TVEnv>(() => {
    return {
      _tag: 'NetworkEffect',
      wire
    }
  })
