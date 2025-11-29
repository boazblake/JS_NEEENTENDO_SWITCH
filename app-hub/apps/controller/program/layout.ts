// controller/layout.ts
import { m } from '@shared/mithril-lite'
import { MessageType, Screen } from '@shared/types'

export const layout = (content: any, model: any, dispatch: any) => {
  const status = model.status ?? 'disconnected'
  const hovered = model.hoveredId ?? null
  const name = model.name || '…'
  const isConnected = status === 'connected'
  console.log(model)
  const statusColor = (s) =>
    s === 'connected' ? '#184' : s === 'connecting' ? '#881' : '#888'

  return m(
    'ion-app',
    null,
    m(
      'ion-page',
      null,

      m(
        'ion-header',
        null,
        m(
          'ion-toolbar',
          { class: 'bg-slate-900 text-white' },
          m(
            'div',
            { class: 'flex items-center justify-between w-full px-4 py-2' },
            m(
              'div',
              { class: 'flex items-center gap-3' },
              m('div', {
                class: 'w-3 h-3 rounded-full',
                style: `background:${statusColor(status)}`
              }),
              m('div', { class: 'text-base font-medium' }, name)
            ),
            m(
              'div',
              {
                class:
                  'text-xs ' +
                  (isConnected ? 'opacity-70' : 'text-red-400 opacity-100')
              },
              status
            )
          )
        )
      ),

      ![Screen.MENU, Screen.LOBBY].includes(model.screen)
        ? m(
            'ion-button',
            {
              class:
                'mx-4 mt-3 bg-blue-600 py-2 rounded text-lg active:scale-95 text-white w-[calc(100%-2rem)]',
              onclick: () => {
                dispatch({
                  type: MessageType.NAVIGATE,
                  msg: { screen: 'menu' }
                })
              }
            },
            `Back`
          )
        : null,

      m(
        'ion-content',
        {
          fullscreen: true,
          class: 'bg-black text-white w-full h-full overflow-y-auto',
          style: 'min-height:100vh;'
        },
        content
      )
    )
  )
}
