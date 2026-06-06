import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // dev: forward /api to the Express backend
      '/api': { target: 'https://urban-harvest-api-2-backend.onrender.com', changeOrigin: true },
    },
  },
  build: { outDir: 'dist', sourcemap: true },
})
