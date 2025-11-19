import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  root: 'apps/tv',
  cacheDir: '../../node_modules/.vite-tv',
  server: {
    port: 5173,
    https: {
      key: '../../certs/192.168.7.195+2-key.pem',
      cert: '../../certs/192.168.7.195+2.pem'
    }
  },
  build: { outDir: '../../dist/tv' },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../../'),
      '@effects': path.resolve(__dirname, '../../effects')
    }
  }
})
