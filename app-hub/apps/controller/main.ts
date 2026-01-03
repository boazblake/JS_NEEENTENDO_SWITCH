import { renderApp } from 'algebraic-fx'
import { renderer } from '@shared/renderer'
import './main.css'
import { program } from './program/index'
import type { ControllerEnv } from './env'
import { Motion } from 'capacitor-native-motion'

// Ionic bootstrap (unchanged)
;(async () => {
  const ionicPath = '/ionic.esm.js'
  await import(/* @vite-ignore */ ionicPath)
})()

import '@ionic/core/css/core.css'
import '@ionic/core/css/normalize.css'
import '@ionic/core/css/structure.css'
// Generate controller identity
const id = Math.random().toString(36).substring(2, 7).toUpperCase()

// Build environment (NO live sockets)
const env: ControllerEnv = {
  window,
  id,
  session: '',
  document,
  motion: Motion,
  makeWebSocket: (url: string) => new WebSocket(url)
}

const root = document.querySelector('#root')
if (!root) throw new Error('#root not found')

// Start app — NOTHING ELSE
renderApp(root, program, env, renderer)
