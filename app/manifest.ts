// Nexora PWA manifest (App Router)
import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Nexora',
    short_name: 'Nexora',
    description: 'Nexora Portal',
    start_url: '/',
    display: 'standalone',
    background_color: '#111827',
    theme_color: '#111827',
    icons: [
      { src: '/icon-16.png', sizes: '16x16', type: 'image/png' },
      { src: '/icon-32.png', sizes: '32x32', type: 'image/png' },
      { src: '/icon-48.png', sizes: '48x48', type: 'image/png' },
      { src: '/icon-96.png', sizes: '96x96', type: 'image/png' },
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-256.png',
        sizes: '256x256',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512-maskable.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}
