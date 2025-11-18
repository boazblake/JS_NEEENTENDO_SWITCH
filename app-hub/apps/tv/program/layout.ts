import { div, button } from '@/shared/renderer.js'

export const layout = (
  content: any,
  model: any,
  dispatch: (m: any) => void
) => {
  const showBack =
    model.screen === 'menu' ||
    model.screen === 'calibration' ||
    model.screen === 'spraycan'

  return div(
    {
      className:
        'relative min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white'
    },
    [
      // main content
      div(
        {
          className: 'flex-1 flex flex-col items-center justify-center w-full'
        },
        content
      ),

      // conditional back button
      showBack
        ? button(
            {
              className:
                'absolute bottom-8 left-8 px-6 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-300 font-semibold shadow-md',
              onclick: () => dispatch({ type: 'NAVIGATE', to: 'menu' })
            },
            '← Back'
          )
        : null
    ]
  )
}
