import { IO } from 'algebraic-js'
import type { Model } from './types.js'

/**
 * Initializes the Spray-Can app.
 * Creates the canvas context and sets up initial model.
 */
export const init = IO(() => {
  const canvas = document.getElementById(
    'sprayCanvas'
  ) as HTMLCanvasElement | null
  const ctx = canvas ? canvas.getContext('2d') : null

  return {
    model: {
      ctx,
      strokes: []
    } as Model,
    effects: []
  }
})
