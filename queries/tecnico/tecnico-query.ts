import { queryOptions } from "@tanstack/react-query"
import { getTecnicoServer } from "../../server/tecnico/get-tecnico-server"
import { OfflineNoCacheError } from "@/lib/offline/errors"

const isClient = typeof window !== "undefined"

export const tecnicoQueryOptions = queryOptions({
	queryKey: ["tecnico"],
	queryFn: async () => {
		try {
			return await getTecnicoServer()
		} catch {
			if (isClient && !navigator.onLine) throw new OfflineNoCacheError()
			throw new Error("Error al cargar técnico")
		}
	},
	// refetchInterval: 60 * 1000, // refrescar cada 60 segundos
})
