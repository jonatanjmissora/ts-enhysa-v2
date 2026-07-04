import { queryOptions } from "@tanstack/react-query"
import { getEmpresasServer } from "../../server/empresas/get-empresas-server"
import { OfflineNoCacheError } from "@/lib/offline/errors"
import {
	saveEntityListToCache,
	getCachedEntityList,
} from "@/lib/offline/db"

const isClient = typeof window !== "undefined"

export const empresasQueryOptions = queryOptions({
	queryKey: ["empresas"],
	queryFn: async () => {
		try {
			const data = await getEmpresasServer()
			if (isClient && data) await saveEntityListToCache("empresas-cache", data)
			return data
		} catch {
			if (!isClient) throw new OfflineNoCacheError()
			const cached = await getCachedEntityList("empresas-cache")
			if (cached.length === 0) throw new OfflineNoCacheError()
			return cached
		}
	},
	networkMode: "always",
	// refetchInterval: 60 * 1000, // refrescar cada 60 segundos
})
