"use client"

import { WifiOff } from "lucide-react"
import { useOnlineStatus } from "@/hooks/use-online-status"

export function OfflineIndicator() {
	const isOnline = useOnlineStatus()

	if (isOnline) return null

	return (
		<div className="text-amber-600">
			<WifiOff size={18} />
		</div>
	)
}
