import { IO, askDocument, browserEnv, runDomIO, renderApp } from 'algebraic-js'
import { renderer } from '@shared/renderer'
import './main.css'
import { program } from './program/index.js'
import { runSocketStream } from '@/effects/network.js'
import { registerResizeIO, registerActionsIO } from '@/effects/global.js'
import eruda from 'eruda'
// eruda.init()

// ---------------------------------------------------------------------------
//  Setup environment
// ---------------------------------------------------------------------------

const ws = new WebSocket('wss://192.168.7.195:8081')
const env = { ...browserEnv(), ws }

// ---------------------------------------------------------------------------
//  Root element
// ---------------------------------------------------------------------------

const rootReader = askDocument.map((doc) =>
  IO(() => doc.querySelector('#root')!)
)
const rootIO = IO(() => runDomIO(rootReader, env))

// ---------------------------------------------------------------------------
//  Render program
// ---------------------------------------------------------------------------

const io = renderApp(renderer, env)(rootIO, program)
const { dispatch } = io.run()

// ---------------------------------------------------------------------------
//  Environment-bound IOs
// ---------------------------------------------------------------------------

// network stream
runSocketStream(ws, dispatch, env)

// window resize listener
runDomIO(registerResizeIO(dispatch), env)

// automatic [data-action] registration
runDomIO(registerActionsIO(dispatch), env)
