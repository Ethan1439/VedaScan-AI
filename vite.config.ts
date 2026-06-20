import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './', // 👈 This automatically sets relative pathing so it won't crash on GitHub Pages
})
