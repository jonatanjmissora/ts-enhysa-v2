import { useEffect } from "react"
import { hasDeferredInstallPrompt } from "#/hooks/use-install"
import { setInstalledFlag } from "#/store/install-store"

export function useInstallVerification() {
	useEffect(() => {
		if (typeof window === "undefined") return

		const verifyInstalledApps = async () => {
			const isStandalone =
				window.matchMedia("(display-mode: standalone)").matches ||
				("standalone" in window.navigator &&
					(window.navigator as Navigator & { standalone?: boolean })
						.standalone === true)

			if (isStandalone) return

			const relatedAppsApi = (
				navigator as Navigator & {
					getInstalledRelatedApps?: () => Promise<unknown[]>
				}
			).getInstalledRelatedApps

			if (!relatedAppsApi) return

			try {
				const relatedApps = await relatedAppsApi.call(navigator)
				if (relatedApps.length > 0) {
					setInstalledFlag(true)
					return
				}

				if (hasDeferredInstallPrompt()) {
					setInstalledFlag(false)
				}
			} catch {
				// Keep the persisted state if the browser rejects the call.
			}
		}

		void verifyInstalledApps()
	}, [])
}
