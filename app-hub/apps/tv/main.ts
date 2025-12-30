import { renderApp } from 'algebraic-fx'
import { renderer } from '@shared/renderer'
import { program } from './program'
import type { TVEnv } from './program/env'

const session = Math.random().toString(36).substring(2, 7).toUpperCase()
const env: TVEnv = {
  window,
  document,
  session,
  makeWebSocket: (url: string) => new WebSocket(url)
}

const root = document.querySelector('#root')
if (!root) throw new Error('#root not found')

renderApp(root as HTMLElement, program, env, renderer)

// // tv/main.ts
// import { renderApp } from 'algebraic-fx'
// import { renderer } from '@shared/renderer'
// import { program } from './program'
// import type { TVEnv } from './program/env'
//
// const env: TVEnv = {
//   window,
//   document,
//   ws: new WebSocket('wss://10.0.0.242:8081/')
// }
//
// const root = document.querySelector('#root')
// if (!root) throw new Error('#root not found')
//
// renderApp(root as HTMLElement, program, env, renderer)
