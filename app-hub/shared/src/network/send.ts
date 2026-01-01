import { IO } from 'algebraic-fx'
import type { WireMsg } from '@shared/protocol'

export type NetworkEffect = {
  _tag: 'NetworkSend'
  msg: WireMsg
}

export const send = (msg: WireMsg) => {
  console.log('send', msg)
  return IO.IO(
    (): NetworkEffect => ({
      _tag: 'NetworkSend',
      msg
    })
  )
}
