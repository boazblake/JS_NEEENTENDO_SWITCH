import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  root: 'apps/controller',
  cacheDir: '../../node_modules/.vite-controller',
  server: { port: 5174 },
  build: { outDir: '../../dist/controller' },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../../'),
      '@effects': path.resolve(__dirname, '../../effects')
    }
  }
})
