import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['@clerk/clerk-react'],
  },
  server: {
    port: 5173,
    strictPort: false,
  },
})
