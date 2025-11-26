// Minimal Mithril-style vdom + renderer, with SVG support, no HTML trust, no fragments, no lifecycle.

// -----------------------------------------------------------------------------
// VNODE
// -----------------------------------------------------------------------------

function Vnode(tag, key, attrs, children, text, dom) {
  return {
    tag: tag,
    key: key,
    attrs: attrs,
    children: children,
    text: text,
    dom: dom
  }
}

// Normalize a single node into a vnode
Vnode.normalize = function (node) {
  if (Array.isArray(node)) {
    // Arrays are just child lists, not fragment vnodes
    return Vnode.normalizeChildren(node)
  }
  if (node == null || typeof node === 'boolean') return null
  if (typeof node === 'object') return node
  // primitive → text vnode
  return Vnode('#', null, null, null, String(node), null)
}

// Normalize a children array into vnodes
Vnode.normalizeChildren = function (input) {
  var out = new Array(input.length)
  var numKeyed = 0
  var numElements = 0

  for (var i = 0; i < input.length; i++) {
    var child = Vnode.normalize(input[i])
    out[i] = child
    if (child && child.tag !== '#') {
      numElements++
      if (child.key != null) numKeyed++
    }
  }

  // All element children either keyed or unkeyed, no mix
  if (numElements > 0 && numKeyed !== 0 && numKeyed !== numElements) {
    throw new TypeError(
      'Children must either all have keys or none have keys (elements only).'
    )
  }

  return out
}

// -----------------------------------------------------------------------------
// HYPERSCRIPT: m(selector, attrs?, ...children)
// Reduced grammar: tag, #id, .class
// -----------------------------------------------------------------------------

var hasOwn = {}.hasOwnProperty
var emptyAttrs = {}
var selectorParser = /(^|#|\.)([^#\.]+)/g
var selectorCache = Object.create(null)

function isEmpty(obj) {
  for (var k in obj) if (hasOwn.call(obj, k)) return false
  return true
}

function compileSelector(selector) {
  var match
  var tag = 'div'
  var classes = []
  var attrs = {}

  while ((match = selectorParser.exec(selector))) {
    var type = match[1]
    var value = match[2]
    if (type === '' && value !== '') tag = value
    else if (type === '#') attrs.id = value
    else if (type === '.') classes.push(value)
  }

  if (classes.length > 0) attrs.className = classes.join(' ')
  if (isEmpty(attrs)) attrs = emptyAttrs
  var compiled = { tag: tag, attrs: attrs }
  selectorCache[selector] = compiled
  return compiled
}

function execSelector(state, vnode) {
  vnode.tag = state.tag
  var attrs = vnode.attrs

  if (attrs == null) {
    vnode.attrs = state.attrs
    return vnode
  }

  if (hasOwn.call(attrs, 'class')) {
    if (attrs.class != null) attrs.className = attrs.class
    attrs.class = null
  }

  if (state.attrs !== emptyAttrs) {
    var className = attrs.className
    attrs = Object.assign({}, state.attrs, attrs)
    if (state.attrs.className != null) {
      attrs.className =
        className != null
          ? String(state.attrs.className) + ' ' + String(className)
          : state.attrs.className
    }
  }

  vnode.attrs = attrs
  return vnode
}

// m(selector, attrs?, ...children)
function hyperscript(selector) {
  if (selector == null || typeof selector !== 'string') {
    throw new Error('Selector must be a string')
  }

  var attrs
  var i = 1
  if (
    i < arguments.length &&
    (arguments[i] == null ||
      (typeof arguments[i] === 'object' && !Array.isArray(arguments[i])))
  ) {
    attrs = arguments[i]
    i++
  }

  var rawChildren = []
  for (; i < arguments.length; i++) rawChildren.push(arguments[i])

  var vnode = Vnode('', attrs && attrs.key, attrs || null, null, null, null)
  vnode.children = Vnode.normalizeChildren(rawChildren)

  var state = selectorCache[selector] || compileSelector(selector)
  return execSelector(state, vnode)
}

// -----------------------------------------------------------------------------
// DOM RENDERER
// Element + text only, with SVG support
// -----------------------------------------------------------------------------

var namespaceMap = {
  svg: 'http://www.w3.org/2000/svg',
  math: 'http://www.w3.org/1998/Math/MathML'
}

function getDocument(dom) {
  return dom.ownerDocument
}

function getNameSpace(vnode) {
  return (vnode.attrs && vnode.attrs.xmlns) || namespaceMap[vnode.tag]
}

// Create a range of nodes
function createNodes(parent, vnodes, start, end, nextSibling, ns) {
  for (var i = start; i < end; i++) {
    var vnode = vnodes[i]
    if (vnode != null) createNode(parent, vnode, ns, nextSibling)
  }
}

function createNode(parent, vnode, ns, nextSibling) {
  var tag = vnode.tag
  if (tag === '#') {
    createText(parent, vnode, nextSibling)
  } else {
    createElement(parent, vnode, ns, nextSibling)
  }
}

function createText(parent, vnode, nextSibling) {
  var dom = (vnode.dom = getDocument(parent).createTextNode(vnode.text || ''))
  insertDOM(parent, dom, nextSibling)
}

function createElement(parent, vnode, ns, nextSibling) {
  var tag = vnode.tag
  var attrs = vnode.attrs
  ns = getNameSpace(vnode) || ns

  var doc = getDocument(parent)
  var element = ns ? doc.createElementNS(ns, tag) : doc.createElement(tag)

  vnode.dom = element

  if (attrs != null) setAttrs(vnode, attrs, ns)

  insertDOM(parent, element, nextSibling)

  var children = vnode.children
  if (children != null) {
    createNodes(element, children, 0, children.length, null, ns)
  }
}

// Main reconciliation
function updateNodes(parent, old, vnodes, nextSibling, ns) {
  if (old === vnodes || (old == null && vnodes == null)) return
  else if (old == null || old.length === 0) {
    createNodes(parent, vnodes, 0, vnodes.length, nextSibling, ns)
  } else if (vnodes == null || vnodes.length === 0) {
    removeNodes(parent, old, 0, old.length)
  } else {
    var isOldKeyed = old[0] != null && old[0].key != null
    var isKeyed = vnodes[0] != null && vnodes[0].key != null
    var start = 0
    var oldStart = 0

    if (!isOldKeyed)
      while (oldStart < old.length && old[oldStart] == null) oldStart++
    if (!isKeyed) while (start < vnodes.length && vnodes[start] == null) start++

    if (isOldKeyed !== isKeyed) {
      removeNodes(parent, old, oldStart, old.length)
      createNodes(parent, vnodes, start, vnodes.length, nextSibling, ns)
      return
    }

    if (!isKeyed) {
      // unkeyed simple diff
      var commonLength = old.length < vnodes.length ? old.length : vnodes.length
      start = start < oldStart ? start : oldStart

      for (; start < commonLength; start++) {
        var o = old[start]
        var v = vnodes[start]
        if (o === v || (o == null && v == null)) continue
        else if (o == null) {
          createNode(parent, v, ns, getNextSibling(old, start + 1, nextSibling))
        } else if (v == null) {
          removeNode(parent, o)
        } else {
          updateNode(
            parent,
            o,
            v,
            getNextSibling(old, start + 1, nextSibling),
            ns
          )
        }
      }

      if (old.length > commonLength) removeNodes(parent, old, start, old.length)
      if (vnodes.length > commonLength)
        createNodes(parent, vnodes, start, vnodes.length, nextSibling, ns)

      return
    }

    // keyed diff (Mithril-style, stripped)
    var oldEnd = old.length - 1
    var end = vnodes.length - 1
    var map, o, v, oe, ve

    // bottom-up match
    while (oldEnd >= oldStart && end >= start) {
      oe = old[oldEnd]
      ve = vnodes[end]
      if (oe == null || ve == null || oe.key !== ve.key) break
      if (oe !== ve) updateNode(parent, oe, ve, nextSibling, ns)
      if (ve.dom != null) nextSibling = ve.dom
      oldEnd--
      end--
    }

    // top-down match
    while (oldEnd >= oldStart && end >= start) {
      o = old[oldStart]
      v = vnodes[start]
      if (o == null || v == null || o.key !== v.key) break
      if (o !== v) {
        updateNode(
          parent,
          o,
          v,
          getNextSibling(old, oldStart + 1, nextSibling),
          ns
        )
      }
      oldStart++
      start++
    }

    if (start > end) {
      removeNodes(parent, old, oldStart, oldEnd + 1)
      return
    }
    if (oldStart > oldEnd) {
      createNodes(parent, vnodes, start, end + 1, nextSibling, ns)
      return
    }

    var originalNextSibling = nextSibling
    var vnodesLength = end - start + 1
    var oldIndices = new Array(vnodesLength)
    var i = 0
    var matched = 0
    var pos = 2147483647

    for (i = 0; i < vnodesLength; i++) oldIndices[i] = -1

    for (i = end; i >= start; i--) {
      if (map == null) map = getKeyMap(old, oldStart, oldEnd + 1)
      ve = vnodes[i]
      var oldIndex = ve && map[ve.key]
      if (oldIndex != null) {
        pos = oldIndex < pos ? oldIndex : -1
        oldIndices[i - start] = oldIndex
        oe = old[oldIndex]
        old[oldIndex] = null
        if (oe !== ve) updateNode(parent, oe, ve, nextSibling, ns)
        if (ve.dom != null) nextSibling = ve.dom
        matched++
      }
    }

    nextSibling = originalNextSibling

    if (matched !== oldEnd - oldStart + 1) {
      removeNodes(parent, old, oldStart, oldEnd + 1)
    }
    if (matched === 0) {
      createNodes(parent, vnodes, start, end + 1, nextSibling, ns)
      return
    }

    var lisIndices
    var li

    if (pos === -1) {
      lisIndices = makeLisIndices(oldIndices)
      li = lisIndices.length - 1
      for (i = end; i >= start; i--) {
        v = vnodes[i]
        if (oldIndices[i - start] === -1) {
          createNode(parent, v, ns, nextSibling)
        } else {
          if (lisIndices[li] === i - start) {
            li--
          } else {
            moveDOM(parent, v, nextSibling)
          }
        }
        if (v.dom != null) nextSibling = v.dom
      }
    } else {
      for (i = end; i >= start; i--) {
        v = vnodes[i]
        if (oldIndices[i - start] === -1) {
          createNode(parent, v, ns, nextSibling)
        }
        if (v.dom != null) nextSibling = v.dom
      }
    }
  }
}

function updateNode(parent, old, vnode, nextSibling, ns) {
  var oldTag = old.tag
  var tag = vnode.tag

  if (old === vnode) return

  if (oldTag === tag) {
    if (tag === '#') {
      updateText(old, vnode)
    } else {
      updateElement(old, vnode, ns)
    }
  } else {
    removeNode(parent, old)
    createNode(parent, vnode, ns, nextSibling)
  }
}

function updateText(old, vnode) {
  if (old.text !== vnode.text) {
    old.dom.nodeValue = vnode.text
  }
  vnode.dom = old.dom
}

function updateElement(old, vnode, ns) {
  var dom = (vnode.dom = old.dom)
  ns = getNameSpace(vnode) || ns

  if (old.attrs !== vnode.attrs) {
    updateAttrs(vnode, old.attrs, vnode.attrs, ns)
  }

  updateNodes(dom, old.children, vnode.children, null, ns)
}

function getKeyMap(vnodes, start, end) {
  var map = Object.create(null)
  for (; start < end; start++) {
    var vnode = vnodes[start]
    if (vnode != null && vnode.key != null) {
      map[vnode.key] = start
    }
  }
  return map
}

var lisTemp = []
function makeLisIndices(a) {
  var result = [0]
  var u = 0
  var v = 0
  var il = (lisTemp.length = a.length)

  for (var i = 0; i < il; i++) lisTemp[i] = a[i]

  for (i = 0; i < il; i++) {
    if (a[i] === -1) continue
    var j = result[result.length - 1]
    if (a[j] < a[i]) {
      lisTemp[i] = j
      result.push(i)
      continue
    }
    u = 0
    v = result.length - 1
    while (u < v) {
      var c = (u + v) >> 1
      if (a[result[c]] < a[i]) u = c + 1
      else v = c
    }
    if (a[i] < a[result[u]]) {
      if (u > 0) lisTemp[i] = result[u - 1]
      result[u] = i
    }
  }

  u = result.length
  v = result[u - 1]
  while (u-- > 0) {
    result[u] = v
    v = lisTemp[v]
  }
  lisTemp.length = 0
  return result
}

function getNextSibling(vnodes, i, nextSibling) {
  for (; i < vnodes.length; i++) {
    var vnode = vnodes[i]
    if (vnode != null && vnode.dom != null) return vnode.dom
  }
  return nextSibling
}

function moveDOM(parent, vnode, nextSibling) {
  if (vnode.dom != null) {
    insertDOM(parent, vnode.dom, nextSibling)
  }
}

function insertDOM(parent, dom, nextSibling) {
  if (nextSibling != null) parent.insertBefore(dom, nextSibling)
  else parent.appendChild(dom)
}

function removeNodes(parent, vnodes, start, end) {
  for (var i = start; i < end; i++) {
    var vnode = vnodes[i]
    if (vnode != null) removeNode(parent, vnode)
  }
}

function removeNode(parent, vnode) {
  if (vnode.dom != null && vnode.dom.parentNode === parent) {
    parent.removeChild(vnode.dom)
  }
}

// -----------------------------------------------------------------------------
// ATTRIBUTES (simplified)
// -----------------------------------------------------------------------------

function setAttrs(vnode, attrs, ns) {
  for (var key in attrs) {
    if (!hasOwn.call(attrs, key)) continue
    setAttr(vnode, key, null, attrs[key], ns)
  }
}

function setAttr(vnode, key, old, value, ns) {
  if (key === 'key') return
  if (value == null) {
    removeAttr(vnode, key, old, ns)
    return
  }

  var dom = vnode.dom

  if (key === 'style') {
    updateStyle(dom, old, value)
    return
  }

  if (key === 'className') {
    dom.setAttribute('class', value)
    return
  }

  if (typeof value === 'boolean') {
    if (value) dom.setAttribute(key, '')
    else dom.removeAttribute(key)
    return
  }

  dom.setAttribute(key, String(value))
}

function removeAttr(vnode, key, old, ns) {
  if (key === 'key' || old == null) return
  var dom = vnode.dom

  if (key === 'style') {
    updateStyle(dom, old, null)
    return
  }
  if (key === 'className') {
    dom.removeAttribute('class')
    return
  }
  dom.removeAttribute(key)
}

function updateAttrs(vnode, old, attrs, ns) {
  var key
  var val

  if (old != null) {
    for (key in old) {
      if (!hasOwn.call(old, key)) continue
      val = old[key]
      if (val != null && (attrs == null || attrs[key] == null)) {
        removeAttr(vnode, key, val, ns)
      }
    }
  }

  if (attrs != null) {
    for (key in attrs) {
      if (!hasOwn.call(attrs, key)) continue
      setAttr(vnode, key, old && old[key], attrs[key], ns)
    }
  }
}

// Very simple style handling
function updateStyle(element, old, style) {
  if (style == null) {
    element.removeAttribute('style')
    return
  }
  if (typeof style === 'string') {
    element.style = style
    return
  }
  // object: reset then assign
  element.removeAttribute('style')
  for (var key in style) {
    if (!hasOwn.call(style, key)) continue
    var value = style[key]
    if (value != null) {
      if (key.indexOf('-') !== -1) {
        element.style.setProperty(key, String(value))
      } else {
        element.style[key] = String(value)
      }
    }
  }
}

// -----------------------------------------------------------------------------
// PUBLIC RENDER
// -----------------------------------------------------------------------------

function render(dom, vnodes) {
  if (!dom) throw new TypeError('DOM element being rendered to does not exist')

  var namespace = dom.namespaceURI

  if (dom.vnodes == null) dom.textContent = ''

  var list = Array.isArray(vnodes) ? vnodes : [vnodes]
  list = Vnode.normalizeChildren(list)

  updateNodes(
    dom,
    dom.vnodes,
    list,
    null,
    namespace === 'http://www.w3.org/1999/xhtml' ? undefined : namespace
  )

  dom.vnodes = list
}

// -----------------------------------------------------------------------------
// EXPORT
// -----------------------------------------------------------------------------

var m = function () {
  return hyperscript.apply(null, arguments)
}

m.render = render
m.vnode = Vnode

// usage example:
// const root = document.getElementById('app')
// const view = state => m('div#app.wrapper', { style: { color: 'red' } }, 'Hello')
// m.render(root, view({}))

module.exports = m
