import { useEffect } from "react"
import { authClient } from "@/lib/auth-client"
import { cacheSession, clearCachedSession } from "../lib/session"

export function OfflineSession() {
	const { data: session, isPending } = authClient.useSession()

	useEffect(() => {
		if (isPending) return

		if (session) {
			void cacheSession(session)
			return
		}

		void clearCachedSession()
	}, [session, isPending])

	return null
}
