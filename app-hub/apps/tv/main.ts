import { IO, askDocument, browserEnv, runDomIO, renderApp } from 'algebraic-js'
import { renderer } from '@/shared/renderer'
import './main.css'
import { program } from './program/index.js'
import { runSocketStream } from '@/effects/network.js'
import { registerResizeIO } from '@/effects/global.js'

const ws = new WebSocket('wss://192.168.7.195:8081')

// merge browser env + socket
const env = { ...browserEnv(), ws }

const rootReader = askDocument.map((doc) =>
  IO(() => doc.querySelector('#root')!)
)
const rootIO = IO(() => runDomIO(rootReader, env))

// renderApp now accepts env explicitly
const io = renderApp(renderer, env)(rootIO, program)
const { dispatch } = io.run()

runSocketStream(ws, dispatch, env)
runDomIO(registerResizeIO(dispatch), env)
