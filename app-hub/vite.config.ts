import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  root: '.',
  server: { port: 5173 },
  build: { outDir: 'dist' },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'), // optional root alias
      '@effects': path.resolve(__dirname, './effects') // <-- remove the trailing /*
    }
  }
})
