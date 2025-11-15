import nanomorph from 'nanomorph'
import hh from 'hyperscript-helpers'
import hyperscript from 'hyperscript' // not as *

let current = null

export const renderer = (root, vnode) => {
  if (!current) {
    root.appendChild(vnode)
    current = vnode
  } else {
    current = nanomorph(current, vnode)
  }
}

export const { div, h1, h2, p, pre, button, section, input, ul, li, span } =
  hh(hyperscript)
