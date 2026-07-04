import { queryOptions } from "@tanstack/react-query"
import { getInstrumentosServer } from "../../server/instrumentos/get-instrumentos-server"
import { OfflineNoCacheError } from "@/lib/offline/errors"
import {
	saveEntityListToCache,
	getCachedEntityList,
} from "@/lib/offline/db"

const isClient = typeof window !== "undefined"

export const instrumentosQueryOptions = queryOptions({
	queryKey: ["instrumentos"],
	queryFn: async () => {
		try {
			const data = await getInstrumentosServer()
			if (isClient && data) await saveEntityListToCache("instrumentos-cache", data)
			return data
		} catch {
			if (!isClient) throw new OfflineNoCacheError()
			const cached = await getCachedEntityList("instrumentos-cache")
			if (cached.length === 0) throw new OfflineNoCacheError()
			return cached
		}
	},
	networkMode: "always",
	// refetchInterval: 60 * 1000, // refrescar cada 60 segundos
})
