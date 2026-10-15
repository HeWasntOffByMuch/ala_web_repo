/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// Na GitHub Actions nazwa repo pochodzi z GITHUB_REPOSITORY; lokalnie domyślnie ala_web_repo.
const repo = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? 'ala_web_repo'
const base = process.env.BASE_PATH ?? `/${repo}/`

export default defineConfig({
  base,
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.png', 'apple-touch-icon.png'],
      workbox: { globPatterns: ['**/*.{js,css,html,svg,png,woff2,webmanifest}'] },
      manifest: {
        name: 'Zakupy',
        short_name: 'Zakupy',
        lang: 'pl',
        display: 'standalone',
        start_url: base,
        scope: base,
        background_color: '#090c10',
        theme_color: '#090c10',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
    }),
  ],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test-setup.ts'],
  },
})
