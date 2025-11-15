import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  root: 'apps/tv',
  cacheDir: '../../node_modules/.vite-tv',
  server: { port: 5173 },
  build: { outDir: '../../dist/tv' },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../../'),
      '@effects': path.resolve(__dirname, '../../effects')
    }
  }
})
