import { queryOptions } from "@tanstack/react-query"
import { getInstrumentosServer } from "../../server/instrumentos/get-instrumentos-server"
import {
	saveEntityListToCache,
	getCachedEntityList,
} from "@/lib/offline/db"
import { OfflineNoCacheError } from "@/lib/offline/errors"

export const instrumentosQueryOptions = queryOptions({
	queryKey: ["instrumentos"],
	queryFn: async () => {
		try {
			const data = await getInstrumentosServer()
			if (typeof window !== "undefined" && data) await saveEntityListToCache("instrumentos-cache", data)
			return data
		} catch {
			if (typeof window !== "undefined") {
				const cached = await getCachedEntityList("instrumentos-cache")
				if (cached.length > 0) return cached
			}
			throw new OfflineNoCacheError()
		}
	},
	networkMode: "always",
})
