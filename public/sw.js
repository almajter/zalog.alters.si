// The build fills in version and files, see astro.config.mjs
const version = 'dev'
const files = []

// Save the whole guide on the first visit. A new version waits until the page says 'skip',
// so the update toast can ask first instead of swapping files mid-visit.
self.addEventListener('install', e => {
  e.waitUntil(caches.open(version).then(c => c.addAll(files)))
})

self.addEventListener('message', e => { if (e.data === 'skip') self.skipWaiting() })

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== version).map(k => caches.delete(k))))
    .then(() => self.clients.claim()))
})

// Cache first, so weak signal doesn't leave you staring at a spinner.
// The page itself also matches with a #hash or ?query. ignoreVary: fonts are fetched with an
// Origin header, so a server sending 'Vary: Origin' would make them miss the cache offline.
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return
  e.respondWith(caches.match(e.request, { ignoreSearch: e.request.mode === 'navigate', ignoreVary: true })
    .then(hit => hit || fetch(e.request)))
})
