import { useEffect } from "react"
import { useOnlineStatus } from "./use-online-status"

let wasOffline = false

export function useAutoReloadOnReconnect() {
	const isOnline = useOnlineStatus()

	useEffect(() => {
		if (typeof window === "undefined") return

		if (isOnline) {
			if (wasOffline) {
				wasOffline = false
				window.location.reload()
			}
		} else {
			wasOffline = true
		}
	}, [isOnline])
}
