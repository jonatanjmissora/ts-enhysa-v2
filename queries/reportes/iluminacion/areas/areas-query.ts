import { queryOptions } from "@tanstack/react-query"
import { getAreasServer } from "../../../../server/reportes/iluminacion/areas/get-areas-server"
import { getAreaServer } from "../../../../server/reportes/iluminacion/areas/get-area-server"

export const areasQueryOptions = ({ reportId }: { reportId: string }) =>
	queryOptions({
		queryKey: ["areas_iluminacion", reportId],
		queryFn: () => getAreasServer({ data: { reportId } }),
		enabled: !!reportId,
		// refetchInterval: 60 * 1000, // refrescar cada 60 segundos
	})

export const areaQueryOptions = ({ areaId }: { areaId: string }) => {
	return queryOptions({
		queryKey: ["area-iluminacion", areaId],
		queryFn: () => getAreaServer({ data: { areaId } }),
		enabled: !!areaId,
	})
}
