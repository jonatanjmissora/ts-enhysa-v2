import { queryOptions } from "@tanstack/react-query"
import { getEmpresasServer } from "../../server/empresas/get-empresas-server"
import {
	saveEntityListToCache,
	getCachedEntityList,
} from "@/lib/offline/db"

export const empresasQueryOptions = queryOptions({
	queryKey: ["empresas"],
	queryFn: async () => {
		try {
			const data = await getEmpresasServer()
			if (typeof window !== "undefined" && data) await saveEntityListToCache("empresas-cache", data)
			return data
		} catch (error) {
			if (typeof window !== "undefined" && !navigator.onLine) {
				const cached = await getCachedEntityList("empresas-cache")
				if (cached.length > 0) return cached
			}
			throw error
		}
	},
	networkMode: "always",
	// refetchInterval: 60 * 1000, // refrescar cada 60 segundos
})
