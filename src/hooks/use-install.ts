import { useState, useEffect, useCallback, useRef } from "react"

interface BeforeInstallPromptEvent extends Event {
	readonly platforms: string[]
	readonly userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>
	prompt(): Promise<void>
}

type InstallState = {
	isInstalled: boolean
	canInstall: boolean
	isIOS: boolean
	install: () => Promise<void>
}

export function useInstall(): InstallState {
	const [isInstalled, setIsInstalled] = useState(false)
	const [canInstall, setCanInstall] = useState(false)
	const [isIOS, setIsIOS] = useState(false)
	const deferredPrompt = useRef<BeforeInstallPromptEvent | null>(null)

	const detectInstalled = useCallback(() => {
		const standalone =
			window.matchMedia("(display-mode: standalone)").matches ||
			("standalone" in window.navigator &&
				(window.navigator as Navigator & { standalone?: boolean }).standalone === true)
		setIsInstalled(standalone)
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

		detectInstalled()
		detectIOS()

		const handleBeforeInstallPrompt = (e: Event) => {
			e.preventDefault()
			deferredPrompt.current = e as BeforeInstallPromptEvent
			setCanInstall(true)
		}

		const handleAppInstalled = () => {
			deferredPrompt.current = null
			setCanInstall(false)
			setIsInstalled(true)
		}

		const handleDisplayModeChange = (e: MediaQueryListEvent) => {
			setIsInstalled(e.matches)
		}

		window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
		window.addEventListener("appinstalled", handleAppInstalled)

		const mediaQuery = window.matchMedia("(display-mode: standalone)")
		mediaQuery.addEventListener("change", handleDisplayModeChange)

		return () => {
			window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
			window.removeEventListener("appinstalled", handleAppInstalled)
			mediaQuery.removeEventListener("change", handleDisplayModeChange)
		}
	}, [detectInstalled, detectIOS])

	const install = useCallback(async () => {
		if (!deferredPrompt.current) return
		deferredPrompt.current.prompt()
		const { outcome } = await deferredPrompt.current.userChoice
		if (outcome === "accepted") {
			deferredPrompt.current = null
			setCanInstall(false)
			setIsInstalled(true)
		}
	}, [])

	return { isInstalled, canInstall, isIOS, install }
}
