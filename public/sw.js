const CACHE_NAME = "enhysa-v1"
const STATIC_CACHE = "enhysa-static-v1"

const PRECACHE_URLS = ["/offline.html"]

self.addEventListener("install", (event) => {
	event.waitUntil(
		caches.open(STATIC_CACHE).then((cache) => cache.addAll(PRECACHE_URLS))
	)
	self.skipWaiting()
})

self.addEventListener("activate", (event) => {
	event.waitUntil(
		Promise.all([
			self.clients.claim(),
			caches.keys().then((keys) =>
				Promise.all(
					keys
						.filter((key) => key !== STATIC_CACHE && key !== CACHE_NAME)
						.map((key) => caches.delete(key))
				)
			),
		])
	)
})

self.addEventListener("fetch", (event) => {
	const { request } = event

	if (request.method !== "GET") return

	const url = new URL(request.url)

	if (url.pathname.startsWith("/_serverFn/")) {
		event.respondWith(
			caches.open(CACHE_NAME).then((cache) =>
				cache.match(request).then((cached) => {
					const fetched = fetch(request)
						.then((response) => {
							if (response.ok) {
								cache.put(request, response.clone())
							}
							return response
						})
						.catch(() =>
							cached
								? cached
								: new Response("Offline", { status: 503 })
						)
					return cached || fetched
				})
			)
		)
		return
	}

	if (
		url.pathname.endsWith(".js") ||
		url.pathname.endsWith(".css") ||
		url.pathname.endsWith(".png") ||
		url.pathname.endsWith(".jpg") ||
		url.pathname.endsWith(".svg") ||
		url.pathname.endsWith(".ico") ||
		url.pathname.endsWith(".woff2")
	) {
		event.respondWith(
			caches.open(STATIC_CACHE).then((cache) =>
				cache.match(request).then((cached) => {
					const fetched = fetch(request).then((response) => {
						if (response.ok) {
							cache.put(request, response.clone())
						}
						return response
					})
					return cached || fetched
				})
			)
		)
		return
	}

	if (request.mode === "navigate") {
		event.respondWith(
			fetch(request)
				.then((response) => {
					if (response.ok) {
						const clone = response.clone()
						caches.open(CACHE_NAME).then((cache) => cache.put(request, clone))
					}
					return response
				})
				.catch(() =>
					caches.match(request).then(
						(cached) => cached || caches.match("/offline.html")
					)
				)
		)
		return
	}

	event.respondWith(
		fetch(request)
			.then((response) => {
				if (response.ok) {
					const clone = response.clone()
					caches.open(CACHE_NAME).then((cache) => cache.put(request, clone))
				}
				return response
			})
			.catch(() => caches.match(request))
	)
})
