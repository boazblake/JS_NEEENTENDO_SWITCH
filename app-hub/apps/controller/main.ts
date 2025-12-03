import { IO, askDocument, browserEnv, runDomIO, renderApp } from 'algebraic-fx'
import { renderer } from '@shared/renderer'
import './main.css'
import { program } from './program/index.js'
import { runSocketStream } from '@effects/network'
import { registerResizeIO } from '@effects/global'
import { Motion } from 'capacitor-native-motion'
// Load Ionic
;(async () => {
  // Set the path to a variable to
  // prevent Vite from analyzing in dev
  const ionicPath = '/ionic.esm.js'
  await import(/* @vite-ignore */ ionicPath)
})()

// Core CSS required for Ionic components to work properly
import '@ionic/core/css/core.css'

// Basic CSS for apps built with Ionic
import '@ionic/core/css/normalize.css'
import '@ionic/core/css/structure.css'
// import '@ionic/core/css/typography.css'

// Optional CSS utils that can be commented out
// import '@ionic/core/css/padding.css'
// import '@ionic/core/css/float-elements.css'
// import '@ionic/core/css/text-alignment.css'
// import '@ionic/core/css/text-transformation.css'
// import '@ionic/core/css/flex-utils.css'
// import '@ionic/core/css/display.css'
// import { Capacitor } from '@capacitor/core'
// Capacitor.setLogLevel('warn')
// 1. Open a WebSocket connection to your relay
// const ws = new WebSocket('wss://192.168.7.195:8081')
const ws = new WebSocket('wss://192.168.7.195:8081')

// 2. Collect controller identity and TV session
//    (later this could come from a login or storage API)
// const session = (prompt('Enter session code from TV') || '').toUpperCase()
const id = Math.random().toString(36).substring(2, 10)

// 3. Build the full environment object
export const env = {
  ...browserEnv(), // document, window, storage, fetch
  ws, // your socket connection
  session: '', // current TV pairing code
  id, // unique controller ID
  motion: Motion
}

// 4. Resolve root DOM node
const rootReader = askDocument.map((doc) =>
  IO(() => doc.querySelector('#root')!)
)

// 5. Create the IO that runs the DOM program
const rootIO = IO(() => runDomIO(rootReader, env))

// 6. Bind the runtime to this environment
const io = renderApp(renderer, env)(rootIO, program)

// 7. Start runtime (dispatch comes from renderApp)
const { dispatch } = io.run()
window.dispatch = dispatch
// 8. Start socket and global listeners
runSocketStream(ws, dispatch, env)
runDomIO(registerResizeIO(dispatch), env)
