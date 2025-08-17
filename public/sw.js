const CACHE_NAME = 'nexora-static-v1'
const STATIC_ASSETS = ['/', '/icon-192.png', '/icon-512.png']

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS)))
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
  )
  self.clients.claim()
})

const OFFLINE_RESPONSE = new Response(
  '<!DOCTYPE html><html><head><meta charset="utf-8"/><title>Offline</title></head><body><h1>Sin conexión</h1><p>Revisa tu conexión e inténtalo de nuevo.</p></body></html>',
  { headers: { 'Content-Type': 'text/html' } }
)

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return

  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match('/') || OFFLINE_RESPONSE)
    )
    return
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached
      return fetch(event.request)
        .then((response) => {
          const clone = response.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone))
          return response
        })
        .catch(() => caches.match('/') || OFFLINE_RESPONSE)
    })
  )
})
