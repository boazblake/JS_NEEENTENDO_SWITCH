import { IO } from 'algebraic-fx'
import type { WireMsg } from '@shared/protocol'

export type NetworkEffect = {
  _tag: 'NetworkSend'
  msg: WireMsg
}

export const send = (msg: WireMsg) =>
  IO.IO(
    (): NetworkEffect => ({
      _tag: 'NetworkSend',
      msg
    })
  )
