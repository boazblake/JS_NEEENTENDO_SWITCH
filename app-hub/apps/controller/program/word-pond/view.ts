// controller/word-pond/view.ts
import { m } from '@shared/mithril-lite'
import { WordPondMsg } from '@shared/types'
import type { Model } from './types'
import type { ControllerCtx } from '../types'

export const view = (model: Model, dispatch: any, _ctx: ControllerCtx) => {
  const state = model.state || {}
  const targetWord = state.targetWord || ''
  const pondLetters = model.pond || []

  return m(
    'div',
    {
      class:
        'min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white px-6'
    },
    m('h1', { class: 'text-3xl font-bold mb-4' }, 'Word Pond'),
    targetWord &&
      m('p', { class: 'text-xl mb-2' }, [
        'Target: ',
        m('span', { class: 'font-mono' }, targetWord)
      ]),
    m(
      'div',
      {
        class:
          'min-h-[3rem] px-4 py-3 mb-6 rounded-lg bg-slate-900/60 border border-slate-700'
      },
      pondLetters.length ? pondLetters.join(' ') : 'Your pond is empty'
    ),
    m(
      'button',
      {
        class:
          'px-8 py-4 bg-orange-600 rounded-full text-lg active:scale-95 transition-transform',
        onclick: () =>
          dispatch(WordPondMsg.SHAKE, {
            // parent wraps this with session/id/screen
          })
      },
      'Shake Pond'
    )
  )
}
