const CACHE_STATIC = "enhysa-static-v1"
const CACHE_PAGES = "enhysa-pages-v1"
const CACHE_API = "enhysa-api-v1"

const PRECACHE_URLS = [
	"/",
	"/offline.html",
	"/manifest.json",
	"/logo192.png",
	"/logo512.png",
	"/favicon.ico",
	"/robots.txt",
]

// --- Install: precache assets clave ---
self.addEventListener("install", (event) => {
	event.waitUntil(
		caches.open(CACHE_STATIC).then((c) => c.addAll(PRECACHE_URLS))
	)
	self.skipWaiting()
})

// --- Activate: limpiar caches viejas ---
self.addEventListener("activate", (event) => {
	event.waitUntil(
		Promise.all([
			self.clients.claim(),
			caches.keys().then((keys) =>
				Promise.all(
					keys
						.filter(
							(k) =>
								k !== CACHE_STATIC &&
								k !== CACHE_PAGES &&
								k !== CACHE_API
						)
						.map((k) => caches.delete(k))
				)
			),
		])
	)
})

// --- Message: soportar SKIP_WAITING desde PWARegister ---
self.addEventListener("message", (event) => {
	if (event.data?.type === "SKIP_WAITING") self.skipWaiting()
})

// --- Fetch: router de estrategias ---
self.addEventListener("fetch", (event) => {
	const { request } = event
	const url = new URL(request.url)

	// Solo interceptar GET
	if (request.method !== "GET") return
	// Ignorar protocolos non-http (chrome-extension, data, etc.)
	if (!url.protocol.startsWith("http")) return

	// API calls → networkFirst
	if (url.pathname.startsWith("/api/")) {
		event.respondWith(networkFirst(request, CACHE_API))
		return
	}

	// Navegación (HTML pages) → networkFirstWithOffline
	if (request.mode === "navigate") {
		event.respondWith(networkFirstWithOffline(request))
		return
	}

	// Todo lo demás (JS, CSS, imágenes, fuentes) → cacheFirst
	event.respondWith(cacheFirst(request, CACHE_STATIC))
})

// --- cacheFirst: servir del cache, si no está → fetch y guardar ---
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

// --- networkFirst: intentar red, si falla → cache, si no hay cache → 503 ---
async function networkFirst(request, cacheName) {
	const cache = await caches.open(cacheName)
	try {
		const response = await fetch(request)
		if (response.ok) cache.put(request, response.clone())
		return response
	} catch {
		const cached = await cache.match(request)
		if (cached) return cached
		return new Response(JSON.stringify({ error: "offline" }), {
			status: 503,
			headers: { "Content-Type": "application/json" },
		})
	}
}

// --- networkFirstWithOffline: intentar red → cache → offline.html ---
async function networkFirstWithOffline(request) {
	const pagesCache = await caches.open(CACHE_PAGES)
	try {
		const response = await fetch(request)
		if (response.ok) pagesCache.put(request, response.clone())
		return response
	} catch {
		const cached = await pagesCache.match(request)
		if (cached) return cached

		const staticCache = await caches.open(CACHE_STATIC)
		const offlinePage = await staticCache.match("/offline.html")
		if (offlinePage) return offlinePage

		return new Response("Offline", { status: 503 })
	}
}
