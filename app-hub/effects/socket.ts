// tv/effects/socket.ts
import { Reader, IO, type Effect } from 'algebraic-fx'
import {
  socketStream,
  readBlobText,
  readArrayBufferText
} from '@/effects/network'
import type { TVEnv } from '../program/env'
import type { TVEnv } from '../program/env'
import type { TVMsg } from '../program/types'

export const socketEffect: Effect<TVEnv, TVMsg> = {
  run(env, dispatch) {
    const stream = socketStream<TVMsg>(env.ws)

    const unsubscribe = stream.subscribe({
      next(reader) {
        const io = reader.run(env)
        Promise.resolve(io.run()).then((msg) => {
          if (msg) dispatch(msg)
        })
      },
      error(err) {
        console.error('socket error', err)
      }
    })

    return () => unsubscribe()
  }
}
