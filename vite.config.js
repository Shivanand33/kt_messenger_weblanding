import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5174,
    host: true,
    open: false,
    strictPort: false,
    // Same-origin API + media so the site works from any device on the LAN
    // (and in production): the browser calls /api and /uploads on whatever
    // host served the page, and the dev server forwards them to the backend.
    // A built bundle with VITE_API_URL set still uses that absolute URL.
    proxy: {
      '/api': { target: 'http://localhost:4000', changeOrigin: true },
      '/uploads': { target: 'http://localhost:4000', changeOrigin: true },
    },
  },
  build: {
    // Admin image overrides are keyed on an asset's filename (see
    // src/utils/imageKey.js). Vite inlines assets under 4 kB as `data:` URIs,
    // which erases that filename — so those images could never be replaced or
    // given ALT text from the CMS. Only four assets are small enough to be
    // affected (kt-logo.svg among them), so keeping every asset as a real file
    // costs almost nothing and keeps the whole registry overridable.
    assetsInlineLimit: 0,
  },
})
