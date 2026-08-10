"use client"

import { WifiOff } from "lucide-react"
import { useOnlineStatus } from "@/hooks/use-online-status"

export function OfflineIndicator() {
	const isOnline = useOnlineStatus()

	if (isOnline) return null

	return (
		<div className="bg-amber-600/20 text-xs text-center italic">
			<span className="inline-flex items-center justify-center gap-1">
				<WifiOff size={8} />
				sin internet
			</span>
		</div>
	)
}
