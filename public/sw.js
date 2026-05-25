/* sw.js — Urban Harvest Hub service worker
 *
 * Strategies:
 *   - App shell + static assets:  cache-first (precached on install)
 *   - API GET requests:           stale-while-revalidate
 *   - Navigation requests:        network-first, fall back to cached shell
 *   - Push notifications:         displayed via the Notifications API
 *
 * Bump CACHE_VERSION to invalidate old caches on deploy.
 */

const CACHE_VERSION = 'uh-v1'
const SHELL_CACHE = `${CACHE_VERSION}-shell`
const API_CACHE   = `${CACHE_VERSION}-api`

// Minimal app shell — Vite hashes asset names, so we cache them at runtime too.
const SHELL_ASSETS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/icon-192.png',
  '/icon-512.png',
  '/offline.html',
]

// ---- Install: precache the shell ----
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) => cache.addAll(SHELL_ASSETS)),
  )
  self.skipWaiting()
})

// ---- Activate: clean up old caches ----
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => !k.startsWith(CACHE_VERSION))
          .map((k) => caches.delete(k)),
      ),
    ),
  )
  self.clients.claim()
})

// ---- Fetch: route by request type ----
self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return // never cache writes

  const url = new URL(request.url)

  // API calls → stale-while-revalidate
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(staleWhileRevalidate(request))
    return
  }

  // Navigations → network-first with offline fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() =>
        caches.match(request).then((r) => r || caches.match('/offline.html')),
      ),
    )
    return
  }

  // Everything else (assets) → cache-first, then network
  event.respondWith(
    caches.match(request).then(
      (cached) =>
        cached ||
        fetch(request).then((res) => {
          const copy = res.clone()
          caches.open(SHELL_CACHE).then((c) => c.put(request, copy))
          return res
        }),
    ),
  )
})

function staleWhileRevalidate(request) {
  return caches.open(API_CACHE).then((cache) =>
    cache.match(request).then((cached) => {
      const network = fetch(request)
        .then((res) => {
          cache.put(request, res.clone())
          return res
        })
        .catch(() => cached) // offline → serve cached
      return cached || network
    }),
  )
}

// ---- Push notifications ----
self.addEventListener('push', (event) => {
  let payload = { title: 'Urban Harvest Hub', body: 'Something new is happening!' }
  try {
    if (event.data) payload = { ...payload, ...event.data.json() }
  } catch {
    if (event.data) payload.body = event.data.text()
  }
  event.waitUntil(
    self.registration.showNotification(payload.title, {
      body: payload.body,
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      tag: 'uh-notification',
    }),
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(self.clients.openWindow('/'))
})
