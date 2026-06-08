import { defineConfig } from 'vite'
import honox from 'honox/vite'
import client from 'honox/vite/client'
import pages from '@hono/vite-cloudflare-pages'

export default defineConfig(({ mode }) => {
  // Jika Vite berjalan dalam mode kompilasi klien (frontend islands)
  if (mode === 'client') {
    return {
      plugins: [client()],
      build: {
        rollupOptions: {
          input: ['./app/client.ts', './app/style.css'],
        },
      },
    }
  }
  
  // Jika Vite berjalan dalam mode kompilasi server (SSR & API)
  return {
    plugins: [
      honox(),
      pages() // Menggunakan adapter Cloudflare Pages
    ],
  }
})
