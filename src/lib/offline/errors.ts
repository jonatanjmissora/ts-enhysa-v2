export class OfflineNoCacheError extends Error {
	constructor(message = "Sin conexión y sin datos guardados para esta página") {
		super(message)
		this.name = "OfflineNoCacheError"
	}
}

export function isOfflineNoCacheError(
	error: unknown
): error is OfflineNoCacheError {
	return error instanceof OfflineNoCacheError
}

const OFFLINE_ERROR_PATTERNS = [
	"Failed to fetch",
	"NetworkError",
	"Network request failed",
	"Load failed",
	"ERR_INTERNET_DISCONNECTED",
	"ERR_NETWORK_CHANGED",
	"ERR_CONNECTION_REFUSED",
	"Loading chunk",
]

export function isOfflineError(error: unknown): boolean {
	if (!error) return false

	if (isOfflineNoCacheError(error)) return true

	const message =
		error instanceof Error
			? error.message
			: typeof error === "string"
				? error
				: ""

	return OFFLINE_ERROR_PATTERNS.some(pattern =>
		message.toLowerCase().includes(pattern.toLowerCase())
	)
}
