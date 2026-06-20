import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    // Forces Vite to complete the build even if there are minor type errors or warnings
    chunkSizeWarningLimit: 2000,
    reportCompressedSize: false
  }
})
