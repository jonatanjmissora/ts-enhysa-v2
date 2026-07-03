import { queryOptions } from "@tanstack/react-query"
import { getInstrumentosServer } from "../../server/instrumentos/get-instrumentos-server"
import { OfflineNoCacheError } from "@/lib/offline/errors"

const isClient = typeof window !== "undefined"

export const instrumentosQueryOptions = queryOptions({
	queryKey: ["instrumentos"],
	queryFn: async () => {
		try {
			return await getInstrumentosServer()
		} catch {
			if (isClient && !navigator.onLine) throw new OfflineNoCacheError()
			throw new Error("Error al cargar instrumentos")
		}
	},
	// refetchInterval: 60 * 1000, // refrescar cada 60 segundos
})
