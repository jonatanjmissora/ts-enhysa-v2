import { queryOptions } from "@tanstack/react-query"
import { getEmpresasServer } from "../../server/empresas/get-empresas-server"
import {
	saveEntityListToCache,
	getCachedEntityList,
} from "@/lib/offline/db"
import { OfflineNoCacheError } from "@/lib/offline/errors"

export const empresasQueryOptions = queryOptions({
	queryKey: ["empresas"],
	queryFn: async () => {
		try {
			const data = await getEmpresasServer()
			if (typeof window !== "undefined" && data) await saveEntityListToCache("empresas-cache", data)
			return data
		} catch {
			if (typeof window !== "undefined") {
				const cached = await getCachedEntityList("empresas-cache")
				if (cached.length > 0) return cached
			}
			throw new OfflineNoCacheError()
		}
	},
	networkMode: "always",
})
