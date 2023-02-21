const CACHE_VERSION = "v2"

// Call install event
self.addEventListener("install", () => {
  console.log("Service Worker: Installed!")
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

  const { method } = event.request
  const url = new URL(event.request.url)

  // any non GET and non-HTTP(S) request is ignored
  if (method.toLowerCase() !== "get" || !/https?/.test(url.protocol)) return

  event.respondWith(
    fetch(event.request)
      // caching requests when there is enternet connection
      .then((res) => {
        // Making a copy of the response
        const resClone = res.clone()

        // Openning caches
        caches.open(CACHE_VERSION).then((cache) => {
          // Adding the response to the cache
          cache.put(event.request, resClone)
        });

        return res;
      })
      .catch(() => {
        // matching old cached pages when there is enternet connection 
        caches.match(event.request).then((res) => res)
      })
  )
})