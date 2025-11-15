import { div, h1, input, button } from '@/renderer.js'

export const view = (model, dispatch) =>
  div(
    {
      class:
        'min-h-screen flex flex-col justify-between items-center bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white px-6 py-10'
    },
    [
      // Header
      h1({ class: 'text-3xl font-bold mb-8' }, '🎨 Spray-Can Controller'),

      // Color picker
      div({ class: 'flex flex-col items-center gap-4 mb-10' }, [
        input({
          type: 'color',
          value: model.color || '#ff0055',
          class:
            'w-28 h-28 rounded-full cursor-pointer border-4 border-white shadow-lg shadow-pink-600/40',
          onchange: (e) =>
            dispatch({ type: 'COLOR_CHANGED', color: e.target.value })
        }),
        div(
          { class: 'text-lg text-slate-300' },
          `Current Color: ${model.color || '#ff0055'}`
        )
      ]),

      // Spray trigger area
      div(
        {
          id: 'trigger-area',
          class:
            'flex-1 w-full rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-2xl font-semibold active:bg-slate-700 select-none transition-colors duration-200',
          ontouchstart: (e) => {
            const rect = e.target.getBoundingClientRect()
            const x = (e.touches[0].clientX - rect.left) / rect.width
            const y = (e.touches[0].clientY - rect.top) / rect.height
            dispatch({
              type: 'TRIGGER_DOWN',
              x,
              y,
              pressure: 1
            })
          },
          onclick: (e) => {
            const rect = e.target.getBoundingClientRect()
            const x = (e.clientX - rect.left) / rect.width
            const y = (e.clientY - rect.top) / rect.height
            dispatch({
              type: 'TRIGGER_DOWN',
              x,
              y,
              pressure: 1
            })
          }
        },
        'Hold to Spray'
      ),

      // Footer
      div({ class: 'mt-6 text-sm text-slate-400' }, `Session: ${model.session}`)
    ]
  )
