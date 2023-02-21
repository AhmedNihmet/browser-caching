const CACHE_VERSION = "v1"
const CACHE_ASSETS = [
  "/favicon.ico",
]

// Call install event
self.addEventListener("install", (event) => {
  console.log("Service Worker: Installed!")

  event.waitUntil(
    caches
      .open(CACHE_VERSION)
      .then((cache) => {
        console.log("Service worker: Caching files!")
        cache.addAll(CACHE_ASSETS)
      })
      .then(() => self.skipWaiting())
  )
})

// Call activate event
self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activated!")

  // Remove unwanted caches
  event.waitUntil(
    caches.keys().then((chacheVersions) => Promise.all(
      chacheVersions.map((oldCache) => {
        if (oldCache !== CACHE_VERSION) {
          console.log("Service Worker: Removing old chaches!")
          return caches.delete(oldCache)
        }

        return null
      })
    ))
  )
})

// Call fetch event
self.addEventListener("fetch", (event) => {
  console.log("Service Worker: Fetching")

  event.respondWith(
    fetch(event.request).catch(() => {
      caches.match(event.request)
    })
  )
})