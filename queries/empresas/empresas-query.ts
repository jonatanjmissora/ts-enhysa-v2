import { queryOptions } from "@tanstack/react-query"
import { getEmpresasServer } from "../../server/empresas/get-empresas-server"
import { OfflineNoCacheError } from "@/lib/offline/errors"

const isClient = typeof window !== "undefined"

export const empresasQueryOptions = queryOptions({
	queryKey: ["empresas"],
	queryFn: async () => {
		try {
			return await getEmpresasServer()
		} catch {
			if (isClient && !navigator.onLine) throw new OfflineNoCacheError()
			throw new Error("Error al cargar empresas")
		}
	},
	// refetchInterval: 60 * 1000, // refrescar cada 60 segundos
})
