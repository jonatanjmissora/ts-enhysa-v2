import { useEffect, useState } from "react"
import { authClient } from "#/lib/auth-client"
import { useOnlineStatus } from "./use-online-status"
import { getCachedSession } from "#/lib/session"

type OfflineSession = {
	user: {
		id: string
		email: string
		name: string
		image?: string | null
	}
}

export function useOfflineAwareSession() {
	const { data: session, isPending } = authClient.useSession()
	const isOnline = useOnlineStatus()
	const [cached, setCached] = useState<OfflineSession | null>(null)
	const [resolved, setResolved] = useState(false)

	useEffect(() => {
		if (!isOnline && !session) {
			getCachedSession().then(s => {
				if (s) {
					setCached({
						user: {
							id: s.userId,
							email: s.email,
							name: s.name,
						},
					})
				}
				setResolved(true)
			})
		} else {
			setResolved(true)
		}
	}, [isOnline, session])

	if (isPending && !cached) {
		return { session: null as OfflineSession | null, isPending: true }
	}

	const effective = session ?? cached ?? null
	return { session: effective, isPending: !resolved }
}
