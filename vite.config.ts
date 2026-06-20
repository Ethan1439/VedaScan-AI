import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './' // 👈 This maps file directories properly so GitHub Pages reads it smoothly
})
