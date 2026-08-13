import { createContext, useContext } from "react"
import type { ReactNode } from "react"
import type { AppSessionState } from "./offline/types"

const AppSessionContext = createContext<AppSessionState | null>(null)

export function AppSessionProvider({
	value,
	children,
}: {
	value: AppSessionState
	children: ReactNode
}) {
	return (
		<AppSessionContext.Provider value={value}>
			{children}
		</AppSessionContext.Provider>
	)
}

export function useAppSession() {
	const value = useContext(AppSessionContext)

	if (!value) {
		throw new Error("useAppSession must be used within AppSessionProvider")
	}

	return value
}
