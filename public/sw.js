const CACHE_NAME = "enhysa-v1"

self.addEventListener("install", (event) => {
	self.skipWaiting()
})

self.addEventListener("activate", (event) => {
	event.waitUntil(
		Promise.all([
			self.clients.claim(),
			caches.keys().then((keys) =>
				Promise.all(
					keys
						.filter((key) => key !== CACHE_NAME)
						.map((key) => caches.delete(key))
				)
			),
		])
	)
})

self.addEventListener("fetch", (event) => {
	event.respondWith(fetch(event.request))
})
