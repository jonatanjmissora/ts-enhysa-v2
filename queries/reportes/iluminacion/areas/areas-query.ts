import { queryOptions } from "@tanstack/react-query"
import { getAreasServer } from "../../../../server/reportes/iluminacion/areas/get-areas-server"

export const areasQueryOptions = ({ reporteId }: { reporteId: string }) =>
	queryOptions({
		queryKey: ["areas_iluminacion", reporteId],
		queryFn: () => getAreasServer({ data: { reporteId } }),
		enabled: !!reporteId,
		// refetchInterval: 60 * 1000, // refrescar cada 60 segundos
	})
