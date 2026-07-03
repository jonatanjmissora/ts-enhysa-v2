export class OfflineNoCacheError extends Error {
	constructor(
		message = "Sin conexión y sin datos guardados para esta página",
	) {
		super(message)
		this.name = "OfflineNoCacheError"
	}
}

export function isOfflineNoCacheError(error: unknown): error is OfflineNoCacheError {
	return error instanceof OfflineNoCacheError
}
