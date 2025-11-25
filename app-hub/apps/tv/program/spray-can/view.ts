// tv/spray-can/view.ts
import { div, span } from '@shared/renderer'

export const view = (model) =>
  div(
    {
      className:
        'fixed inset-0 overflow-visible pointer-events-none bg-transparent'
    },
    model.spray.dots.map((d) =>
      span({
        className: 'absolute rounded-full pointer-events-none',
        style: `
          left:${d.x}px;
          top:${d.y}px;
          width:${d.size}px;
          height:${d.size}px;
          background:${d.color};
          opacity:${d.opacity};
          filter: blur(${d.size / 2}px);
          z-index:999999;
        `
      })
    )
  )
