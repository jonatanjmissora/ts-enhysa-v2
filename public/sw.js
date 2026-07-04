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

// --- Install: precache assets clave ---
self.addEventListener("install", (event) => {
	event.waitUntil(
		caches.open(STATIC_CACHE).then((cache) => cache.addAll(PRECACHE_URLS))
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
