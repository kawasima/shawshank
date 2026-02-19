import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    allowedHosts: true,
    proxy: {
      '/u': 'http://localhost:3000',
      '/d': 'http://localhost:3000',
      '/stream': 'http://localhost:3000',
    }
  },
  build: {
    outDir: 'dist'
  }
})
