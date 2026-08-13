import type {
	AppSession,
	AppSessionState,
	CachedSession,
	RootSessionState,
} from "./types"
import { getCachedSession } from "../session"

function mapServerSession(
	session: NonNullable<RootSessionState["serverSession"]>
): AppSession {
	return {
		user: {
			id: session.user.id,
			email: session.user.email,
			name: session.user.name,
			image: session.user.image,
		},
	}
}

function mapCachedSession(session: CachedSession): AppSession {
	return {
		user: {
			id: session.userId,
			email: session.email,
			name: session.name,
			image: session.image ?? null,
		},
	}
}

export async function resolveAppSession(
	rootSessionState: RootSessionState
): Promise<AppSessionState> {
	if (rootSessionState.serverSession) {
		return {
			status: "authenticated",
			session: mapServerSession(rootSessionState.serverSession),
			source: "server",
		}
	}

	if (rootSessionState.serverState === "ok") {
		return {
			status: "anonymous",
			session: null,
			source: "none",
		}
	}

	if (typeof window === "undefined") {
		return {
			status: "resolving",
			session: null,
			source: "none",
		}
	}

	const cached = await getCachedSession()

	if (cached) {
		return {
			status: "authenticated",
			session: mapCachedSession(cached),
			source: "cache",
		}
	}

	return {
		status: "offline-no-session",
		session: null,
		source: "none",
	}
}

export { mapCachedSession, mapServerSession }
