import { IO, askDocument, browserEnv, runDomIO, renderApp } from 'algebraic-js'
import { renderer } from '@/renderer'
import './main.css'
import { createProgram } from './program/index.js'
import { runSocketStream } from '@/effects/network.js'
import { registerGlobalIO } from '@/effects/global.js'

const ws = new WebSocket('ws://localhost:8081')

// merge browser env + socket
const env = { ...browserEnv(), ws }

const rootReader = askDocument.map((doc) =>
  IO(() => doc.querySelector('#root')!)
)
const rootIO = IO(() => runDomIO(rootReader, env))

// renderApp now accepts env explicitly
const io = renderApp(renderer, env)(rootIO, createProgram())
const { dispatch } = io.run()

runSocketStream(ws, dispatch, env)
runDomIO(registerGlobalIO(dispatch), env)
