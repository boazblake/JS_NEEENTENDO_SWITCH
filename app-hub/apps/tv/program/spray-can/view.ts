import { div, h1, canvas } from '@/renderer'

export const view = (model) =>
  div({ class: 'relative w-screen h-screen bg-neutral-900 overflow-hidden' }, [
    canvas({
      id: 'sprayCanvas',
      width: 1920,
      height: 1080,
      class: 'absolute top-0 left-0 w-full h-full'
    }),
    // Header overlay
    div(
      {
        class:
          'absolute top-0 left-0 w-full flex justify-between items-center p-6 pointer-events-none'
      },
      [
        h1(
          { class: 'text-4xl font-bold text-white drop-shadow-lg' },
          'Spray-Can'
        ),
        div(
          { class: 'text-lg font-mono text-teal-300' },
          `Session: ${model.session}`
        )
      ]
    )
  ])
