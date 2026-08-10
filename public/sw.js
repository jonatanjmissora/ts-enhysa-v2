const CACHE_NAME = "enhysa-v1"
const STATIC_CACHE = "enhysa-static-v1"

const PRECACHE_URLS = [
	"/",
	"/offline.html",
	"/manifest.json",
	"/logo192.png",
	"/logo512.png",
	"/favicon.ico",
	"/robots.txt",
]

self.addEventListener("message", event => {
	if (event.data?.type === "SKIP_WAITING") self.skipWaiting()
	if (event.data?.type === "UNREGISTER") {
		self.registration.unregister()
		caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k))))
	}
})

self.addEventListener("install", event => {
	event.waitUntil(
		caches.open(STATIC_CACHE).then(cache => cache.addAll(PRECACHE_URLS))
	)
	self.skipWaiting()
})

self.addEventListener("activate", event => {
	event.waitUntil(
		Promise.all([
			self.clients.claim(),
			caches
				.keys()
				.then(keys =>
					Promise.all(
						keys
							.filter(key => key !== STATIC_CACHE && key !== CACHE_NAME)
							.map(key => caches.delete(key))
					)
				),
		])
	)
})

self.addEventListener("fetch", event => {
	const { request } = event
	const url = new URL(request.url)

	if (request.method !== "GET") return
	if (!url.protocol.startsWith("http")) return
	if (url.pathname.startsWith("/api/")) return

	if (url.pathname.startsWith("/_serverFn/")) {
		event.respondWith(networkFirst(request, CACHE_NAME))
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
		event.respondWith(cacheFirst(request, STATIC_CACHE))
		return
	}

	if (request.mode === "navigate") {
		event.respondWith(networkFirstWithOffline(request))
		return
	}

	event.respondWith(networkFirst(request, CACHE_NAME))
})

async function cacheFirst(request, cacheName) {
	const cache = await caches.open(cacheName)
	const cached = await cache.match(request)
	if (cached) return cached

	try {
		const fetchRequest = new Request(request, { redirect: "follow" })
		const response = await fetch(fetchRequest)
		if (response.ok && response.type !== "opaqueredirect") {
			cache.put(request, response.clone())
		}
		return response
	} catch {
		return new Response("", { status: 408 })
	}
}

async function networkFirst(request, cacheName) {
	const cache = await caches.open(cacheName)
	try {
		const fetchRequest = new Request(request, { redirect: "follow" })
		const response = await fetch(fetchRequest)
		if (response.ok && response.type !== "opaqueredirect") {
			cache.put(request, response.clone())
		}
		return response
	} catch {
		const cached = await cache.match(request)
		if (cached) return cached
		return new Response("Offline", { status: 503 })
	}
}

async function networkFirstWithOffline(request) {
	try {
		const fetchRequest = new Request(request, { redirect: "follow" })
		const response = await fetch(fetchRequest)
		if (
			response.ok &&
			response.type !== "opaqueredirect" &&
			!response.redirected
		) {
			const clone = response.clone()
			caches.open(CACHE_NAME).then(cache => cache.put(request, clone))
		}
		return response
	} catch {
		const cached = await caches.match(request)
		if (cached) return cached

		const staticCache = await caches.open(STATIC_CACHE)
		const offlinePage = await staticCache.match("/offline.html")
		if (offlinePage) return offlinePage

		return new Response("Offline", { status: 503 })
	}
}
