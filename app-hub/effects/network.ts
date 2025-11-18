import { Stream, Reader, IO, type DomEnv, type Dispatch } from 'algebraic-js'
import { MessageType, NetworkMessage } from '@/shared/types.js'

/**
 * Pure Reader<DomEnv, IO> for sending a message over WebSocket.
 * Describes the effect but does not execute it until interpreted
 * with a concrete environment containing `ws`.
 */

export const sendMsg = (msg: NetworkMessage) =>
  Reader((env) =>
    IO(() => {
      const ws = env.ws
      const data = JSON.stringify({ ...msg, time: Date.now() })
      if (ws.readyState === WebSocket.OPEN) ws.send(data)
      else {
        const onOpen = () => {
          ws.send(data)
          ws.removeEventListener('open', onOpen)
        }
        ws.addEventListener('open', onOpen)
      }
    })
  )

/** Reader describing Blob.text() */
export const readBlobText = (blob: Blob): Reader<DomEnv, IO<string>> =>
  Reader(() => IO(() => blob.text()))

/** Reader describing ArrayBuffer → string */
export const readArrayBufferText = (
  buf: ArrayBuffer
): Reader<DomEnv, IO<string>> =>
  Reader(() => IO(() => new TextDecoder().decode(buf)))

/** WebSocket message stream (Reader<DomEnv, IO<T>> events) */
export const socketStream = <T = any>(
  ws: WebSocket
): Stream<Reader<DomEnv, IO<T>>> =>
  Stream((observer) => {
    const onMsg = (e: MessageEvent) => {
      try {
        if (e.data instanceof Blob) {
          observer.next(
            readBlobText(e.data).map((io) =>
              IO(async () => JSON.parse(await io.run()) as T)
            )
          )
        } else if (e.data instanceof ArrayBuffer) {
          observer.next(
            readArrayBufferText(e.data).map((io) =>
              IO(async () => JSON.parse(await io.run()) as T)
            )
          )
        } else if (typeof e.data === 'string') {
          observer.next(Reader(() => IO(() => JSON.parse(e.data) as T)))
        } else {
          observer.error?.(new Error('Unsupported WebSocket message type'))
        }
      } catch (err) {
        observer.error?.(err)
      }
    }

    const onErr = (e: Event) => observer.error?.(e)
    const onClose = () => observer.complete?.()

    ws.addEventListener('message', onMsg)
    ws.addEventListener('error', onErr)
    ws.addEventListener('close', onClose)

    return () => {
      ws.removeEventListener('message', onMsg)
      ws.removeEventListener('error', onErr)
      ws.removeEventListener('close', onClose)
    }
  })

/** IO for safe send (imperative helper, still available) */
export const sendIO = (ws: WebSocket, msg: any): IO<void> =>
  IO(() => {
    const data = JSON.stringify(msg)
    if (ws.readyState === WebSocket.OPEN) ws.send(data)
    else {
      const onOpen = () => {
        ws.send(data)
        ws.removeEventListener('open', onOpen)
      }
      ws.addEventListener('open', onOpen)
    }
  })

/** Run the socket stream inside a concrete environment */
export const runSocketStream = <T>(
  ws: WebSocket,
  dispatch: Dispatch,
  env: DomEnv
): (() => void) => {
  const stream = socketStream<T>(ws)
  return stream.subscribe({
    next: (rio) => {
      try {
        const io = rio.run(env)
        Promise.resolve(io.run()).then((payload) => dispatch(payload))
      } catch (err) {
        console.error('socketStream error', err)
      }
    },
    error: (e) => console.error('WebSocket error', e),
    complete: () => console.log('WebSocket closed')
  })
}
