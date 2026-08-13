import type { Session, User } from "better-auth"

export type CachedSession = {
	userId: string
	email: string
	name: string
	image?: string | null
}

export type AppSession = {
	user: {
		id: string
		email: string
		name: string
		image?: string | null
	}
}

export type ServerSessionResponse = {
	session: Session
	user: User
} | null

export type RootSessionState = {
	session: ServerSessionResponse
	serverSession: ServerSessionResponse
	serverState: "ok" | "unreachable"
}

export type AppSessionState = {
	status: "authenticated" | "anonymous" | "offline-no-session" | "resolving"
	session: AppSession | null
	source: "server" | "cache" | "none"
}
