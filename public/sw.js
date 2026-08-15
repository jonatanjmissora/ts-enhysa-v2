const SW_VERSION = "v2"
const CACHE_STATIC = `app-static-${SW_VERSION}`
const CACHE_PAGES = `app-pages-${SW_VERSION}`

const PRECACHE_URLS = [
	"/",
	"/landing",
	"/login",
	"/offline.html",
	"/manifest.json",
	"/logo192.png",
	"/logo512.png",
	"/working-on-it.webp",
	"/completa.webp",
	"/reducida.webp",
	"/favicon.ico",
]

self.addEventListener("install", event => {
	event.waitUntil(
		caches
			.open(CACHE_STATIC)
			.then(cache => cache.addAll(PRECACHE_URLS))
			.catch(err => console.error("[SW] precache failed", err))
	)
	self.skipWaiting()
})

self.addEventListener("activate", event => {
	event.waitUntil(
		caches.keys().then(keys =>
			Promise.all(
				keys
					.filter(k => !k.startsWith("app-static-") && !k.startsWith("app-pages-"))
					.map(k => caches.delete(k))
			)
		)
	)
	self.clients.claim()
})

self.addEventListener("message", event => {
	if (event.data?.type === "SKIP_WAITING") self.skipWaiting()
})

self.addEventListener("fetch", event => {
	const { request } = event
	const url = new URL(request.url)

	if (request.method !== "GET") return
	if (!url.protocol.startsWith("http")) return

	if (url.pathname.startsWith("/api/auth/")) return
	if (url.pathname.startsWith("/_serverFn/")) return

	if (request.mode === "navigate") {
		event.respondWith(networkFirstWithOffline(request))
		return
	}

	event.respondWith(cacheFirst(request, CACHE_STATIC))
})

async function cacheFirst(request, cacheName) {
	const cache = await caches.open(cacheName)
	const cached = await cache.match(request)
	if (cached) return cached

	try {
		const response = await fetch(request)
		if (response.ok) cache.put(request, response.clone())
		return response
	} catch {
		return new Response("", { status: 408 })
	}
}

async function networkFirstWithOffline(request) {
	const cache = await caches.open(CACHE_PAGES)
	try {
		const response = await fetch(request)
		if (response.ok) cache.put(request, response.clone())
		return response
	} catch {
		const cached = await cache.match(request)
		if (cached) return cached

		const staticCache = await caches.open(CACHE_STATIC)
		const precachedRoute = await staticCache.match(request)
		if (precachedRoute) return precachedRoute

		const offlinePage = await staticCache.match("/offline.html")
		if (offlinePage) return offlinePage

		return new Response("Offline", { status: 503 })
	}
}
