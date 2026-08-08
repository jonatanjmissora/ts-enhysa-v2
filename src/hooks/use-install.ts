import { useState, useEffect, useCallback } from "react"
import { setInstalledFlag } from "#/store/install-store"

interface BeforeInstallPromptEvent extends Event {
	readonly platforms: string[]
	readonly userChoice: Promise<{
		outcome: "accepted" | "dismissed"
		platform: string
	}>
	prompt(): Promise<void>
}

let deferredPrompt: BeforeInstallPromptEvent | null = null

type InstallState = {
	isStandalone: boolean
	canInstall: boolean
	isIOS: boolean
	install: () => Promise<void>
}

export function useInstall(): InstallState {
	const [isStandalone, setIsStandalone] = useState(false)
	const [canInstall, setCanInstall] = useState(() => deferredPrompt !== null)
	const [isIOS, setIsIOS] = useState(false)

	const detectStandalone = useCallback(() => {
		const standalone =
			window.matchMedia("(display-mode: standalone)").matches ||
			("standalone" in window.navigator &&
				(window.navigator as Navigator & { standalone?: boolean })
					.standalone === true)
		setIsStandalone(standalone)
	}, [])

	const detectIOS = useCallback(() => {
		const userAgent = window.navigator.userAgent.toLowerCase()
		const isIos =
			/iphone|ipad|ipod/.test(userAgent) &&
			!(window as unknown as { MSStream?: boolean }).MSStream
		setIsIOS(isIos)
	}, [])

	useEffect(() => {
		if (typeof window === "undefined") return

		detectStandalone()
		detectIOS()

		const handleBeforeInstallPrompt = (e: Event) => {
			e.preventDefault()
			deferredPrompt = e as BeforeInstallPromptEvent
			setCanInstall(true)
		}

		const handleAppInstalled = () => {
			deferredPrompt = null
			setCanInstall(false)
			setInstalledFlag(true)
		}

		const handleDisplayModeChange = (e: MediaQueryListEvent) => {
			setIsStandalone(e.matches)
		}

		window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
		window.addEventListener("appinstalled", handleAppInstalled)

		const mediaQuery = window.matchMedia("(display-mode: standalone)")
		mediaQuery.addEventListener("change", handleDisplayModeChange)

		return () => {
			window.removeEventListener(
				"beforeinstallprompt",
				handleBeforeInstallPrompt
			)
			window.removeEventListener("appinstalled", handleAppInstalled)
			mediaQuery.removeEventListener("change", handleDisplayModeChange)
		}
	}, [detectStandalone, detectIOS])

	const install = useCallback(async () => {
		const promptEvent = deferredPrompt
		if (!promptEvent) return

		try {
			await promptEvent.prompt()
			const { outcome } = await promptEvent.userChoice
			if (outcome === "accepted") {
				setInstalledFlag(true)
			}
		} finally {
			deferredPrompt = null
			setCanInstall(false)
		}
	}, [])

	return { isStandalone, canInstall, isIOS, install }
}
