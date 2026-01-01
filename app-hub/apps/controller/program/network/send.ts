import { IO } from 'algebraic-fx'
import type { Payload } from '@shared/types'
import type { ControllerEnv } from '../env'

export const send = ({ type, msg, t }: Payload) =>
  IO.IO<ControllerEnv>(() => ({
    _tag: 'NetworkEffect',
    type,
    msg,
    t
  }))
