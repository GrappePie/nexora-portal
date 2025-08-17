const CACHE_NAME = 'nexora-static-v1'
const STATIC_ASSETS = ['/', '/icon-192.png', '/icon-512.png']

const DB_NAME = 'nexora-outbox'
const STORE_NAME = 'requests'
const RETRIES = 3

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1)
    req.onupgradeneeded = () => {
      req.result.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true })
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

function addRequest(data) {
  return openDB().then(
    (db) =>
      new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite')
        tx.oncomplete = () => resolve()
        tx.onerror = () => reject(tx.error)
        tx.objectStore(STORE_NAME).add(data)
      })
  )
}

function getRequests() {
  return openDB().then(
    (db) =>
      new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readonly')
        const req = tx.objectStore(STORE_NAME).getAll()
        req.onsuccess = () => resolve(req.result)
        req.onerror = () => reject(req.error)
      })
  )
}

function removeRequest(id) {
  return openDB().then(
    (db) =>
      new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite')
        tx.oncomplete = () => resolve()
        tx.onerror = () => reject(tx.error)
        tx.objectStore(STORE_NAME).delete(id)
      })
  )
}

function delay(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

async function processOutbox() {
  const items = await getRequests()
  for (const item of items) {
    let sent = false
    for (let i = 0; i < RETRIES && !sent; i++) {
      try {
        await fetch(item.url, {
          method: item.method,
          headers: item.headers,
          body: item.body,
        })
        sent = true
      } catch (err) {
        await delay(1000 * (i + 1))
      }
    }
    if (sent && item.id !== undefined) {
      await removeRequest(item.id)
    }
  }
}

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
  const req = event.request

  if (req.method !== 'GET') {
    event.respondWith(
      fetch(req.clone()).catch(async () => {
        const body = await req.clone().text()
        await addRequest({
          url: req.url,
          method: req.method,
          headers: Array.from(req.headers.entries()),
          body,
        })
        if ('sync' in self.registration) {
          await self.registration.sync.register('sync-outbox')
        }
        return new Response(JSON.stringify({ stored: true }), {
          headers: { 'Content-Type': 'application/json' },
          status: 202,
        })
      })
    )
    return
  }

  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).catch(() => caches.match('/') || OFFLINE_RESPONSE)
    )
    return
  }

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached
      return fetch(req)
        .then((response) => {
          const clone = response.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(req, clone))
          return response
        })
        .catch(() => caches.match('/') || OFFLINE_RESPONSE)
    })
  )
})

self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-outbox') {
    event.waitUntil(processOutbox())
  }
})
