import { localDb, type SessionLocal } from "../../../indexed-db/database"
import type { CachedSession } from "../offline/types"

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

export async function getCachedSession(): Promise<CachedSession | null> {
	const session = await localDb.session.toCollection().first()
	if (!session) return null

	return {
		userId: session.id,
		email: session.email,
		name: session.name,
	}
}

export async function clearCachedSession() {
	await localDb.session.clear()
}
