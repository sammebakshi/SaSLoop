import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    minify: false,
    sourcemap: false,
    chunkSizeWarningLimit: 2000,
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: false,
  }
})
