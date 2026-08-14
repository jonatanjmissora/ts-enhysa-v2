const CACHE_STATIC = "app-static-v1"
const CACHE_PAGES = "app-pages-v1"

const PRECACHE_URLS = [
	"/",
	"/offline.html",
	"/manifest.json",
	"/logo192.png",
	"/logo512.png",
	"/working-on-it.webp",
	"/favicon.ico",
	"/iluminacion",
	"/iluminacion/reportes",
	"/perfil/tecnicos",
	"/perfil/empresas",
	"/perfil/instrumentos",
]

self.addEventListener("install", event => {
	event.waitUntil(
		caches
			.open(CACHE_STATIC)
			.then(cache => cache.addAll(PRECACHE_URLS))
			.catch(() => {})
	)
	self.skipWaiting()
})

self.addEventListener("activate", event => {
	event.waitUntil(
		caches.keys().then(keys =>
			Promise.all(
				keys
					.filter(k => k !== CACHE_STATIC && k !== CACHE_PAGES)
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