import { localDb, type SessionLocal } from "../../../indexed-db/database"
import { getSession } from "../../../server/get-session"

export type AppSession = {
	user: {
		id: string
		email: string
		name: string
	}
	source: "server" | "cache"
}

export async function getCachedSession() {
	console.log("getCachedSession", {
		window: typeof window !== "undefined",
		indexedDB: typeof indexedDB !== "undefined",
	})
	// try {
	// 	const session = await getSession()

	// 	// El servidor respondió correctamente y no existe sesión.
	// 	if (!session) {
	// 		return null
	// 	}

	// 	const sessionLocal: SessionLocal = {
	// 		user: {
	// 			id: session.user.id,
	// 			email: session.user.email,
	// 			name: session.user.name,
	// 		},
	// 	}

	// 	// Actualizamos la sesión local.
	// 	await localDb.session.clear()
	// 	await localDb.session.put(sessionLocal)

	// 	return {
	// 		user: {
	// 			id: session.user.id,
	// 			email: session.user.email,
	// 			name: session.user.name,
	// 		},
	// 		source: "server",
	// 	}
	// } catch {
	// 	// Probablemente estamos offline.
	// 	const cachedSession = await localDb.session.toCollection().first()

	// 	if (!cachedSession) {
	// 		return null
	// 	}

	// 	return {
	// 		user: {
	// 			id: cachedSession.user.id,
	// 			email: cachedSession.user.email,
	// 			name: cachedSession.user.name,
	// 		},
	// 		source: "cache",
	// 	}
	// }
}
