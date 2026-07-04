"use client"

import { useOnlineStatus } from "@/hooks/use-online-status"
import { WifiOff } from "lucide-react"

export function OfflineIndicator() {
	const isOnline = useOnlineStatus()

	if (isOnline) return null

	return (
		<div className="fixed bottom-0 left-0 right-0 z-50 bg-amber-600 text-white px-4 py-2 text-sm flex items-center justify-center gap-2">
			<WifiOff size={14} />
			Sin conexión
		</div>
	)
}
