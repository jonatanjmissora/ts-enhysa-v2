import { queryOptions } from "@tanstack/react-query"
import { getAreasServer } from "../../../../server/reportes/iluminacion/areas/get-areas-server"

export const areasQueryOptions = queryOptions({
	queryKey: ["areas_iluminacion"],
	queryFn: () => getAreasServer(),
	// refetchInterval: 60 * 1000, // refrescar cada 60 segundos
})
