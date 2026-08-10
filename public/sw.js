self.addEventListener("message", event => {
	if (event.data?.type === "SKIP_WAITING") self.skipWaiting()
	if (event.data?.type === "UNREGISTER") {
		self.registration.unregister()
		caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k))))
	}
})

self.addEventListener("install", () => {
	self.skipWaiting()
})

self.addEventListener("activate", event => {
	event.waitUntil(
		Promise.all([
			self.clients.claim(),
			caches.keys().then(keys => Promise.all(keys.map(key => caches.delete(key)))),
		])
	)
})
