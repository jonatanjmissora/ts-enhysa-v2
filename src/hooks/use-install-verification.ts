import { useEffect } from "react"
import { setInstalledFlag } from "#/store/install-store"

export function useInstallVerification() {
	useEffect(() => {
		if (typeof window === "undefined") return

		const verifyInstalledApps = async () => {
			const relatedAppsApi = (
				navigator as Navigator & {
					getInstalledRelatedApps?: () => Promise<unknown[]>
				}
			).getInstalledRelatedApps

			if (!relatedAppsApi) return

			try {
				const relatedApps = await relatedAppsApi.call(navigator)
				setInstalledFlag(relatedApps.length > 0)
			} catch {
				// Keep the persisted state if the browser rejects the call.
			}
		}

		void verifyInstalledApps()
	}, [])
}
