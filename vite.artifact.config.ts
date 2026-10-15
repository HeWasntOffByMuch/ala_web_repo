import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  resolve: { alias: { 'virtual:pwa-register': path.resolve('scripts/pwa-stub.ts') } },
  build: { outDir: 'dist-artifact', assetsInlineLimit: 100000000, cssCodeSplit: false },
})
