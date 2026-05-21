import { queryOptions } from "@tanstack/react-query"
import { getInstrumentosServer } from "../../server/instrumentos/get-instrumentos-server"

export const instrumentosQueryOptions = queryOptions({
	queryKey: ["instrumentos"],
	queryFn: () => getInstrumentosServer(),
	// refetchInterval: 60 * 1000, // refrescar cada 60 segundos
})
