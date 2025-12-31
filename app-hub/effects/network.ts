// // app-hub/effects/network.ts
// import { Stream, Reader, IO, type DomEnv, type Dispatch } from 'algebraic-fx'
// import type { Payload } from '../shared/src/types.ts'
//
// /** Env that carries both DOM and a WebSocket connection */
// export type WsEnv = DomEnv & { ws: WebSocket }
//
// /**
//  * Periodic broadcaster.
//  *
//  * Produces an IO that:
//  *  - subscribes to a Stream.interval(ms)
//  *  - on each tick, calls getState()
//  *  - sends `{ type: "STATE_SYNC", msg: { state } }` over the given ws
//  *  - returns an unsubscribe function as cleanup
//  */
// export const broadcastState = <State>(
//   ws: WebSocket,
//   getState: () => State,
//   ms = 2000
// ): IO<() => void> => {
//   const s = Stream.interval(ms)
//
//   return IO(() => {
//     const unsub = s.subscribe({
//       next: () => {
//         const state = getState()
//         const msg = { type: 'STATE_SYNC', msg: { state } }
//         console.log('[broadcastState]', JSON.stringify(msg))
//         sendIO(ws, msg).run()
//       },
//       error: (e) => console.error('[broadcastState]', e)
//     })
//
//     return unsub
//   })
// }
//
// /**
//  * Pure Reader<WsEnv, IO<void>> for sending a message over WebSocket.
//  * Describes the effect but does not execute it until interpreted
//  * with a concrete environment containing `ws`.
//  */
// export const sendMsg = (payload: Payload): Reader<WsEnv, IO<void>> =>
//   Reader((env) =>
//     IO(() => {
//       const ws = env.ws
//       const data = JSON.stringify(payload)
//
//       if (ws.readyState === WebSocket.OPEN) {
//         ws.send(data)
//       } else {
//         const onOpen = () => {
//           ws.send(data)
//           ws.removeEventListener('open', onOpen)
//         }
//         ws.addEventListener('open', onOpen)
//       }
//     })
//   )
//
// /** Reader describing Blob.text() */
// export const readBlobText = (blob: Blob): Reader<DomEnv, IO<string>> =>
//   Reader(() => IO(() => blob.text()))
//
// /** Reader describing ArrayBuffer → string */
// export const readArrayBufferText = (
//   buf: ArrayBuffer
// ): Reader<DomEnv, IO<string>> =>
//   Reader(() => IO(() => new TextDecoder().decode(buf)))
//
// /**
//  * WebSocket message stream.
//  *
//  * Produces a Stream of Reader<DomEnv, IO<T>> where each event describes
//  * how to decode the incoming message into a parsed payload of type T.
//  */
// export const socketStream = <T = any>(
//   ws: WebSocket
// ): Stream<Reader<DomEnv, IO<T>>> =>
//   Stream((observer) => {
//     const onMsg = (e: MessageEvent) => {
//       try {
//         if (e.data instanceof Blob) {
//           observer.next(
//             readBlobText(e.data).map((io) =>
//               IO(async () => JSON.parse(await io.run()) as T)
//             )
//           )
//         } else if (e.data instanceof ArrayBuffer) {
//           observer.next(
//             readArrayBufferText(e.data).map((io) =>
//               IO(async () => JSON.parse(await io.run()) as T)
//             )
//           )
//         } else if (typeof e.data === 'string') {
//           observer.next(Reader(() => IO(() => JSON.parse(e.data) as T)))
//         } else {
//           observer.error?.(new Error('Unsupported WebSocket message type'))
//         }
//       } catch (err) {
//         observer.error?.(err)
//       }
//     }
//
//     const onErr = (e: Event) => observer.error?.(e)
//     const onClose = () => observer.complete?.()
//
//     ws.addEventListener('message', onMsg)
//     ws.addEventListener('error', onErr)
//     ws.addEventListener('close', onClose)
//
//     return () => {
//       ws.removeEventListener('message', onMsg)
//       ws.removeEventListener('error', onErr)
//       ws.removeEventListener('close', onClose)
//     }
//   })
//
// /**
//  * IO for safe send (imperative helper).
//  *
//  * This is useful in non-Program code (e.g. server, quick scripts)
//  * where you want to fire-and-forget without Reader<Env>.
//  */
// export const sendIO = (ws: WebSocket, msg: any): IO<void> =>
//   IO(() => {
//     const data = JSON.stringify(msg)
//     if (ws.readyState === WebSocket.OPEN) ws.send(data)
//     else {
//       const onOpen = () => {
//         ws.send(data)
//         ws.removeEventListener('open', onOpen)
//       }
//       ws.addEventListener('open', onOpen)
//     }
//   })
//
// /**
//  * Run the socket stream inside a concrete DOM environment.
//  *
//  * Adapts:
//  *   Stream<Reader<DomEnv, IO<T>>>
//  * into:
//  *   IO that calls `dispatch(payload: T)` for each parsed message.
//  */
// export const runSocketStream = <T>(
//   ws: WebSocket,
//   dispatch: Dispatch<T>,
//   env: DomEnv
// ): (() => void) => {
//   const stream = socketStream<T>(ws)
//
//   return stream.subscribe({
//     next: (rio) => {
//       try {
//         const io = rio.run(env)
//         Promise.resolve(io.run()).then((payload) => {
//           if (payload) dispatch(payload)
//         })
//       } catch (err) {
//         console.error('socketStream error', err)
//       }
//     },
//     error: (e) => console.error('WebSocket error', e),
//     complete: () => console.log('WebSocket closed')
//   })
// }
