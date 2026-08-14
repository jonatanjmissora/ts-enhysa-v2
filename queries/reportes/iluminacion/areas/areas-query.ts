import { queryOptions, useQueryClient } from "@tanstack/react-query"
import { getAreaServer } from "../../../../server/reportes/iluminacion/areas/get-area-server"
import type { AreaIluminacionType } from "../../../../db/reportes/iluminacion/areas/schema"
import { areasRepository } from "../../../../repositories/reportes/iluminacion/areas-repository"

export const areasQueryOptions = ({ reportId }: { reportId: string }) =>
	queryOptions({
		queryKey: ["areas-iluminacion", reportId],
		queryFn: () => areasRepository.get(reportId),
		enabled: !!reportId,
	})

export const areaQueryOptions = ({ areaId }: { areaId: string }) => {
	const queryClient = useQueryClient()
	return queryOptions({
		queryKey: ["area-iluminacion", areaId],
		queryFn: () => getAreaServer({ data: { areaId } }),
		enabled: !!areaId,
		initialData: () => {
			const areaQueries = queryClient.getQueriesData<AreaIluminacionType[]>({
				queryKey: ["areas-iluminacion"],
			})
			const areas = areaQueries.flatMap(([, data]) => data ?? [])
			return areas?.find(item => item.id === areaId)
		},
	})
}
