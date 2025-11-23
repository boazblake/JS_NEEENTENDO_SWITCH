WordPond (edu-games)

A LAN party style family game that teaches phonemic awareness through physical play. The repository is a monorepo with a first game, WordPond, built on a small Elm-like runtime using explicit algebraic effects and a real VDOM diffing renderer.

⸻

Repository layout

edu-games/
├── flake.nix # optional Nix dev shell
├── pnpm-workspace.yaml
├── games/
│ └── wordpond/
│ ├── apps/
│ │ ├── tv/ # display app (renderer, audio, speech)
│ │ │ ├── index.html
│ │ │ ├── main.ts
│ │ │ └── vite.config.ts
│ │ └── controller/ # mobile controller app
│ │ ├── index.html
│ │ ├── main.ts
│ │ └── vite.config.ts
│ ├── core/
│ │ └── update/
│ │ └── network-test.ts # minimal program for end-to-end wiring
│ ├── server/
│ │ └── main.ts # local WebSocket relay
│ ├── shared/
│ │ ├── renderer.ts # nanomorph + hyperscript-helpers renderer
│ │ └── registerGlobalIO.ts # window resize IO via Reader
│ ├── package.json
│ ├── tsconfig.json
│ ├── eslint.config.js
│ └── .prettierrc

⸻

Technology
• Runtime and ADTs: effects-vdom (IO, Reader, Task, Either, etc.)
• Renderer: nanomorph plus hyperscript-helpers and hyperscript
• Dev server and bundling: Vite 6
• Controller native access: Capacitor (Haptics, Motion, Network) planned
• LAN sync: Node ws WebSocket relay
• Linting: ESLint 9 flat config and oxlint fast checks
• Formatting: Prettier

⸻

Prerequisites
• Node 20.19 or newer for oxlint
• pnpm installed globally or use Nix flake shell

Optional Nix shell

cd edu-games
nix develop

⸻

Install

cd edu-games/games/wordpond
pnpm install

⸻

Development

Start the WebSocket relay

pnpm run server

Start both Vite servers in parallel

pnpm run dev

    •	TV runs on http://localhost:5173
    •	Controller runs on http://localhost:5174

Vite cache directories are isolated to avoid collisions when both servers run:
• apps/tv/vite.config.ts uses cacheDir: '../../node_modules/.vite-tv'
• apps/controller/vite.config.ts uses cacheDir: '../../node_modules/.vite-controller'

⸻

Runtime model

The program is pure and explicit about effects.

type EffectLike = IO<void>

type Program<M, Msg> = {
init: IO<{ model: M; effects: EffectLike[] }>
update: (msg: Msg, model: M, dispatch: Dispatch) => { model: M; effects: EffectLike[] }
view: (model: M, dispatch: Dispatch) => any // VNode tree
}

    •	init runs once and returns model plus startup effects
    •	update is pure, returns the next model and a list of effects
    •	view is pure and builds a vnode tree
    •	EffectLike must implement .run(), typically created by IO(() => { ... })

The loop is started with renderApp(renderer)(rootIO, program).run(). The renderer is a function (root, vnode) => void that applies the vnode to the DOM.

Dispatch is batched on requestAnimationFrame. Effects run after each render. No side effects inside update.

⸻

Renderer

shared/renderer.ts provides a real DOM diff via nanomorph and helpers for vnode creation.

import nanomorph from "nanomorph"
import hh from "hyperscript-helpers"
import \* as hyperscript from "hyperscript"

const h: any = (hyperscript as any).default || hyperscript
let current: Element | null = null

export const renderer = (root: Element, vnode: Element) => {
if (!current) {
root.appendChild(vnode)
current = vnode
} else {
current = nanomorph(current, vnode)
}
}

export const { div, h1, h2, p, pre, button, section, input, ul, li, span } =
hh(h)

    •	renderer keeps a moving pointer to the current DOM tree and patches it with nanomorph
    •	hyperscript-helpers functions return VNodes compatible with the renderer

⸻

DOM and environment IO

Use Reader<DomEnv, IO<A>> to build DOM-bound IO values, then run them with a concrete environment. Example: window resize subscription that dispatches RESIZE to the program.

// shared/registerGlobalIO.ts
import { Reader, IO } from "effects-vdom"
import type { DomEnv } from "effects-vdom/core/dom.js"
import type { Dispatch } from "effects-vdom"

export const registerGlobalIO = (dispatch: Dispatch) =>
Reader<DomEnv, IO<() => void>>((env) =>
IO(() => {
const resize = () =>
dispatch({
type: "RESIZE",
width: env.window.innerWidth,
height: env.window.innerHeight,
})
env.window.addEventListener("resize", resize)
resize()
return () => env.window.removeEventListener("resize", resize)
})
)

Run a Reader-provided IO with a real browser env

import { browserEnv } from "effects-vdom/core/dom.js"

registerGlobalIO(dispatch).run(browserEnv()).run()

⸻

Networking

A minimal stateless WebSocket relay broadcasts any message to all other clients.

// server/main.ts
import { WebSocketServer } from "ws"

const wss = new WebSocketServer({ port: 8081 })
const clients = new Set<WebSocket>()

wss.on("connection", (socket) => {
clients.add(socket)
socket.on("message", (data) => {
for (const client of clients)
if (client !== socket && client.readyState === 1) client.send(data)
})
socket.on("close", () => clients.delete(socket))
})

Controller and TV keep one socket each and forward inbound payloads to the program as NETWORK_IN.

⸻

TV and Controller entrypoints

Each app uses the same program but injects its own WebSocket and environment-bound IO.

TV

// apps/tv/main.ts
import { IO, renderApp } from "effects-vdom"
import { renderer } from "../../shared/renderer.js"
import { createProgram } from "../../core/update/network-test.js"
import { registerGlobalIO } from "../../shared/registerGlobalIO.js"
import { browserEnv } from "effects-vdom/core/dom.js"

const ws = new WebSocket("ws://localhost:8081")
let dispatchRef: ((msg: any) => void) | null = null

ws.onmessage = (e) => {
try { dispatchRef?.({ type: "NETWORK_IN", payload: JSON.parse(e.data as string) }) } catch {}
}

const rootIO = IO(() => document.querySelector("#app") as Element)
const { init, update, view } = createProgram(ws)
const { dispatch } = renderApp(renderer)(rootIO, { init, update, view }).run()
dispatchRef = dispatch

registerGlobalIO(dispatch).run(browserEnv()).run()

Controller

// apps/controller/main.ts
import { IO, renderApp } from "effects-vdom"
import { renderer } from "../../shared/renderer.js"
import { createProgram } from "../../core/update/network-test.js"
import { registerGlobalIO } from "../../shared/registerGlobalIO.js"
import { browserEnv } from "effects-vdom/core/dom.js"

const ws = new WebSocket("ws://localhost:8081")
let dispatchRef: ((msg: any) => void) | null = null

ws.onopen = () => ws.send(JSON.stringify({ type: "HELLO", from: "controller", t: Date.now() }))
ws.onmessage = (e) => {
try { dispatchRef?.({ type: "NETWORK_IN", payload: JSON.parse(e.data as string) }) } catch {}
}

const rootIO = IO(() => document.querySelector("#app") as Element)
const { init, update, view } = createProgram(ws)
const { dispatch } = renderApp(renderer)(rootIO, { init, update, view }).run()
dispatchRef = dispatch

registerGlobalIO(dispatch).run(browserEnv()).run()

⸻

Program example

core/update/network-test.ts is a minimal program that demonstrates pure updates and IO effects.

import { IO } from "effects-vdom"
import type { Dispatch } from "effects-vdom"
import { div, h2, p, button } from "../../shared/renderer.js"

export type Model = { count: number }
export type Msg =
| { type: "INC" }
| { type: "NETWORK_IN"; payload: unknown }

export const createProgram = (ws: WebSocket) => {
const init = IO(() => ({
model: { count: 0 } as Model,
effects: [IO(() => console.log("[WordPond] init"))],
}))

const update = (msg: Msg, model: Model, \_dispatch: Dispatch) => {
switch (msg.type) {
case "INC": {
const next = { count: model.count + 1 }
return {
model: next,
effects: [
IO(() => ws.send(JSON.stringify({ type: "COUNT", value: next.count }))),
IO(() => console.log("[send]", next.count)),
],
}
}
case "NETWORK_IN":
return { model, effects: [IO(() => console.log("[recv]", msg.payload))] }
default:
return { model, effects: [] }
}
}

const view = (m: Model, dispatch: Dispatch) =>
div({ id: "wordpond" }, [
h2("WordPond (Network Test)"),
p(`Count: ${m.count}`),
button({ onclick: () => dispatch({ type: "INC" }) }, "Increment"),
])

return { init, update, view }
}

⸻

Linting and formatting

ESLint 9 flat config and oxlint

// eslint.config.js
import js from "@eslint/js"
import tseslint from "typescript-eslint"
import prettier from "eslint-config-prettier"

export default tseslint.config(
js.configs.recommended,
...tseslint.configs.recommended,
prettier,
{
files: ["**/*.ts", "**/*.tsx"],
rules: {
"@typescript-eslint/no-explicit-any": "error",
"@typescript-eslint/explicit-module-boundary-types": "off"
}
}
)

Commands

pnpm run lint
pnpm run lint:fast
pnpm run format
pnpm run typecheck

⸻

Production build

Build TV

pnpm vite build --config apps/tv/vite.config.ts

Build Controller

pnpm vite build --config apps/controller/vite.config.ts

Serve from dist/tv and dist/controller. The relay can run as a separate Node service or be replaced by a LAN-capable signaling service.

⸻

Capacitor integration plan
• Wrap Motion and Haptics in IO interpreters inside the Controller app
• Convert high-frequency Motion samples into throttled messages over the WebSocket
• Add Haptic feedback as an IO effect on successful catches
• Gate background networking by Capacitor platform rules

⸻

Rendering with PixiJS on TV
• Replace or layer the DOM view with a PixiJS scene
• Wrap Pixi operations in IO effects so the update remains pure
• Keep the same message and model contracts

⸻

Troubleshooting
• vite: command not found
Use pnpm vite or npx vite. In Vite 6 the root is a positional argument. Use per-app vite.config.ts or npx vite apps/tv.
• Two dev servers error ENOTEMPTY on .vite/deps
Configure cacheDir uniquely per app.
• run-p: command not found
Install npm-run-all locally and use pnpm run dev.
• ESLint error about typescript-eslint
Install the new meta package typescript-eslint and use the flat config API.
• oxlint engine warning
Use Node 20.19 or newer.
• No messages arriving between apps
Confirm the relay is running on port 8081 and that both apps use the same ws URL.

⸻

Roadmap
• Implement game modes: Phoneme Hunt, Word Builder, Rhyme Race, Family Challenge
• Add sound effects and speech synthesis as IO effects on TV
• Add Motion and Haptic interpreters via Capacitor on Controller
• Add score persistence via storageSet and storageGet Reader IO
• Migrate relay to service discovery or mDNS for multi-device pairing
