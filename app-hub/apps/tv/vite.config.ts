import { defineConfig } from 'vite'
import path from 'path'
import fs from 'fs'

export default defineConfig({
  root: '.',
  cacheDir: '../../node_modules/.vite-tv',

  server: {
    port: 5173,
    https: {
      key: fs.readFileSync(
        path.resolve(__dirname, '../../certs/multi-ip-key.pem')
      ),
      cert: fs.readFileSync(path.resolve(__dirname, '../../certs/multi-ip.pem'))
    },
    hmr: {
      protocol: 'wss',
      host: 'wordpond.local',
      port: 5173
    }
  },

  build: {
    outDir: '../dist/tv',
    emptyOutDir: true
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../../'),
      '@effects': path.resolve(__dirname, '../../effects'),
      '@shared': path.resolve(__dirname, '../../shared/src')
    }
  }
})
