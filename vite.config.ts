import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Prevent DNS rebinding attacks in local dev
    allowedHosts: ['localhost', '127.0.0.1'],
  },
  build: {
    // Generate source maps for debugging but keep them private
    sourcemap: 'hidden',
  },
})
