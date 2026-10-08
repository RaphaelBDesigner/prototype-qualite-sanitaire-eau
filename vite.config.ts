import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages sert le site sous /<nom-du-repo>/
  base: '/prototype-qualite-sanitaire-eau/',
})
