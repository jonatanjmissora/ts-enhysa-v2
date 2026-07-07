import { queryOptions } from "@tanstack/react-query"
import { getInstrumentosServer } from "../../server/instrumentos/get-instrumentos-server"
import {
	saveEntityListToCache,
	getCachedEntityList,
} from "@/lib/offline/db"

export const instrumentosQueryOptions = queryOptions({
	queryKey: ["instrumentos"],
	queryFn: async () => {
		try {
			const data = await getInstrumentosServer()
			if (typeof window !== "undefined" && data) await saveEntityListToCache("instrumentos-cache", data)
			return data
		} catch (error) {
			if (typeof window !== "undefined" && !navigator.onLine) {
				const cached = await getCachedEntityList("instrumentos-cache")
				if (cached.length > 0) return cached
			}
			throw error
		}
	},
	networkMode: "always",
	// refetchInterval: 60 * 1000, // refrescar cada 60 segundos
})
