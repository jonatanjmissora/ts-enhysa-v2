import { Navigate } from "@tanstack/react-router"
import { useEffect, useState } from "react"
import type { ReactNode } from "react"
import { AppSessionProvider } from "#/lib/app-session-context"
import { resolveAppSession } from "#/lib/offline/resolve-app-session"
import type { AppSessionState, RootSessionState } from "#/lib/offline/types"

function getInitialState(rootSessionState: RootSessionState): AppSessionState {
	if (rootSessionState.serverSession) {
		return {
			status: "authenticated",
			session: {
				user: {
					id: rootSessionState.serverSession.user.id,
					email: rootSessionState.serverSession.user.email,
					name: rootSessionState.serverSession.user.name,
					image: rootSessionState.serverSession.user.image,
				},
			},
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

	return {
		status: "resolving",
		session: null,
		source: "none",
	}
}

export function OfflineSessionGate({
	rootSessionState,
	children,
}: {
	rootSessionState: RootSessionState
	children: ReactNode
}) {
	const [state, setState] = useState<AppSessionState>(() =>
		getInitialState(rootSessionState)
	)

	useEffect(() => {
		let cancelled = false

		async function run() {
			if (
				rootSessionState.serverSession ||
				rootSessionState.serverState === "ok"
			) {
				return
			}

			const resolved = await resolveAppSession(rootSessionState)

			if (!cancelled) {
				setState(resolved)
			}
		}

		void run()

		return () => {
			cancelled = true
		}
	}, [rootSessionState])

	if (state.status === "resolving") {
		return (
			<div className="min-h-svh flex items-center justify-center text-sm text-muted-foreground">
				Cargando sesion...
			</div>
		)
	}

	if (state.status === "offline-no-session") {
		return (
			<div className="min-h-svh flex items-center justify-center px-6 text-center text-sm text-muted-foreground">
				No hay una sesion local disponible para abrir esta seccion offline.
			</div>
		)
	}

	if (state.status === "anonymous") {
		return <Navigate to="/landing" />
	}

	return <AppSessionProvider value={state}>{children}</AppSessionProvider>
}
