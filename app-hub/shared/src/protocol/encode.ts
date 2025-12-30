import type { WireMsg } from './types'

export const encode = (msg: WireMsg): string => {
  return JSON.stringify(msg)
}
