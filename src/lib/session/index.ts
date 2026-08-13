import { localDb, type SessionLocal } from "../../../indexed-db/database"

export async function cacheSession(authSession: {
	user: {
		id: string
		email: string
		name: string
	}
}) {
	const sessionLocal: SessionLocal = {
		id: authSession.user.id,
		email: authSession.user.email,
		name: authSession.user.name,
	}

	await localDb.session.put(sessionLocal)
}

export async function getCachedSession() {
	return await localDb.session.toCollection().first()
}

export async function clearCachedSession() {
	await localDb.session.clear()
}
