import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  root: '.',
  cacheDir: '../../node_modules/.vite-controller',
  server: {
    port: 5174,
    https: {
      key: path.resolve(__dirname, '../../certs/multi-ip-key.pem'),
      cert: path.resolve(__dirname, '../../certs/multi-ip.pem')
    },
  },
  build: {
    outDir: '../dist/controller',
    emptyOutDir: true
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../../'),
      '@effects': path.resolve(__dirname, '../../effects'),
      '@shared': path.resolve(__dirname, '../../shared/src'),
    }
  }
})
