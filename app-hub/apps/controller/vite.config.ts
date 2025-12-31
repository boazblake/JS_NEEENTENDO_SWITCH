import { defineConfig } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import path from 'path'
import fs from 'fs'

export default defineConfig({
  optimizeDeps: {
    exclude: ['@ionic/core']
  },
  root: '.',
  cacheDir: '../../node_modules/.vite-controller',
  server: {
    hmr: {
      protocol: 'https'
    },
    port: 5174,
    https: {
      key: fs.readFileSync(
        path.resolve(__dirname, '../../certs/multi-ip-key.pem')
      ),
      cert: fs.readFileSync(path.resolve(__dirname, '../../certs/multi-ip.pem'))
    }
  },
  build: {
    outDir: '../dist/controller',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: undefined
      },
      external: ['/ionic.esm.js']
    }
  },
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: './node_modules/@ionic/core/dist/ionic/*',
          dest: ''
        }
      ]
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../../'),
      '@effects': path.resolve(__dirname, '../../effects'),
      '@shared': path.resolve(__dirname, '../../shared/src')
    }
  }
})
