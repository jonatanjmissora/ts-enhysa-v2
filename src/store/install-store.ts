import { useSyncExternalStore } from "react"

const STORAGE_KEY = "pwa-installed"
const CHANGE_EVENT = "pwa-installed-change"

function isBrowser() {
	return typeof window !== "undefined"
}

function getSnapshot() {
	if (!isBrowser()) return false
	return window.localStorage.getItem(STORAGE_KEY) === "true"
}

function getServerSnapshot() {
	return false
}

function notifyChange() {
	if (!isBrowser()) return
	window.dispatchEvent(new Event(CHANGE_EVENT))
}

export function getInstalledFlag(): boolean {
	return getSnapshot()
}

export function setInstalledFlag(value: boolean) {
	if (!isBrowser()) return

	if (value) {
		window.localStorage.setItem(STORAGE_KEY, "true")
	} else {
		window.localStorage.removeItem(STORAGE_KEY)
	}

	notifyChange()
}

function subscribe(callback: () => void) {
	if (!isBrowser()) return () => undefined

	const handleStorage = (event: StorageEvent) => {
		if (event.storageArea !== window.localStorage) return
		if (event.key !== STORAGE_KEY && event.key !== null) return
		callback()
	}

	window.addEventListener("storage", handleStorage)
	window.addEventListener(CHANGE_EVENT, callback)

	return () => {
		window.removeEventListener("storage", handleStorage)
		window.removeEventListener(CHANGE_EVENT, callback)
	}
}

export function useInstalledFlag(): boolean {
	return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
