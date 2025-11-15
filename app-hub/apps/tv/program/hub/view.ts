import { div, h1, p, button } from '@/renderer.js'

export const view = (model, dispatch) =>
  div(
    {
      class:
        'min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col items-center justify-center'
    },
    [
      // Title
      h1(
        { class: 'text-6xl font-extrabold tracking-tight mb-2' },
        'Nexus Arcade'
      ),
      p({ class: 'text-slate-400 mb-12 text-lg' }, 'Select a game to begin'),

      // Game buttons
      div({ class: 'flex flex-col gap-6 w-72' }, [
        button(
          {
            class:
              'w-full py-4 rounded-lg bg-gradient-to-r from-pink-500 to-rose-600 text-lg font-semibold shadow-lg shadow-pink-800/40 hover:scale-105 transform transition-all duration-300',
            onclick: () => dispatch({ type: 'SELECT_APP', app: 'spraycan' })
          },
          '🎨 Spray-Can'
        ),
        button(
          {
            class:
              'w-full py-4 rounded-lg bg-gradient-to-r from-sky-500 to-blue-600 text-lg font-semibold shadow-lg shadow-sky-800/40 hover:scale-105 transform transition-all duration-300',
            onclick: () => dispatch({ type: 'SELECT_APP', app: 'wordpond' })
          },
          '🌊 WordPond'
        ),
        button(
          {
            class:
              'w-full py-4 rounded-lg bg-gradient-to-r from-violet-500 to-purple-600 text-lg font-semibold shadow-lg shadow-violet-800/40 hover:scale-105 transform transition-all duration-300 opacity-50 cursor-not-allowed',
            disabled: true
          },
          '🌀 Maze (coming soon)'
        )
      ])
    ]
  )
