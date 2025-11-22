import { div, canvas, h1 } from '@shared/renderer'

export const view = () =>
  div(
    {
      className:
        'relative w-screen h-screen bg-slate-900 overflow-hidden text-white'
    },
    [
      canvas({
        id: 'sprayCanvas',
        width: 1920,
        height: 1080,
        className: 'absolute top-0 left-0 w-full h-full bg-slate-900'
      }),
      h1(
        {
          className:
            'absolute top-6 left-8 text-3xl font-bold text-pink-400 drop-shadow'
        },
        'Spray-Can'
      )
    ]
  )
