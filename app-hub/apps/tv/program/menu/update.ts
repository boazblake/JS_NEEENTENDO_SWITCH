import { MessageType } from '@shared/types'
import { orientationToXY } from '../effects'

export const update = (msg: Msg, model: Model) => {
  console.log(msg)
  switch (msg.type) {
    case MessageType.CALIB_UPDATE: {
      const smooth = (a: number, b: number, f = 0.1) => a + (b - a) * f
      const { q, g } = payload.msg
      const [x, y] = orientationToXY(
        q,
        g,
        window.innerWidth,
        window.innerHeight
      )
      const xs = smooth(model.pointer.x, x)
      const ys = smooth(model.pointer.y, y)
      return { model: { ...model, pointer: { x: xs, y: ys } }, effects: [] }
    }

    case 'SELECT_APP':
      return { model: { ...model, screen: msg.app }, effects: [] }

    case 'BACK_TO_MENU':
      return { model: { ...model, screen: Screen.MENU }, effects: [] }

    default:
      return { model, effects: [] }
  }
}
