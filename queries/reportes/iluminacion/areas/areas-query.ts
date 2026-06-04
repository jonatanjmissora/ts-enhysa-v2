import { queryOptions, useQueryClient } from "@tanstack/react-query"
import { getAreasServer } from "../../../../server/reportes/iluminacion/areas/get-areas-server"
import { getAreaServer } from "../../../../server/reportes/iluminacion/areas/get-area-server"
import type { AreaIluminacionType } from "../../../../db/reportes/iluminacion/areas/schema"

export const areasQueryOptions = ({ reportId }: { reportId: string }) =>
	queryOptions({
		queryKey: ["areas-iluminacion", reportId],
		queryFn: () => getAreasServer({ data: { reportId } }),
		enabled: !!reportId,
		// refetchInterval: 60 * 1000, // refrescar cada 60 segundos
	})

export const areaQueryOptions = ({ areaId }: { areaId: string }) => {
	const queryClient = useQueryClient()
	return queryOptions({
		queryKey: ["area-iluminacion", areaId],
		queryFn: () => getAreaServer({ data: { areaId } }),
		enabled: !!areaId,
		initialData: () => {
					const areas = queryClient.getQueryData<AreaIluminacionType[]>([
						"areas-iluminacion",
					])
					return areas?.find(item => item.id === areaId)
				},
	})
}
