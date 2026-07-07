import { queryOptions, useQueryClient } from "@tanstack/react-query"
import { getAreasServer } from "../../../../server/reportes/iluminacion/areas/get-areas-server"
import { getAreaServer } from "../../../../server/reportes/iluminacion/areas/get-area-server"
import type { AreaIluminacionType } from "../../../../db/reportes/iluminacion/areas/schema"
import {
	getCachedEntitiesByField,
	getCachedEntityById,
	putEntityInCache,
	saveEntityListToCache,
} from "@/lib/offline/db"

export const areasQueryOptions = ({ reportId }: { reportId: string }) =>
	queryOptions({
		queryKey: ["areas-iluminacion", reportId],
		queryFn: async () => {
			try {
				const data = await getAreasServer({ data: { reportId } })
				if (typeof window !== "undefined" && data)
					await saveEntityListToCache("areas-iluminacion-cache", data)
				return data
			} catch (error) {
				if (typeof window !== "undefined" && !navigator.onLine) {
					const cached = await getCachedEntitiesByField(
						"areas-iluminacion-cache",
						"reportId",
						reportId
					)
					if (cached.length > 0) return cached
				}
				throw error
			}
		},
		enabled: !!reportId,
		networkMode: "always",
		// refetchInterval: 60 * 1000, // refrescar cada 60 segundos
	})

export const areaQueryOptions = ({ areaId }: { areaId: string }) => {
	const queryClient = useQueryClient()
	return queryOptions({
		queryKey: ["area-iluminacion", areaId],
		queryFn: async () => {
			try {
				const data = await getAreaServer({ data: { areaId } })
				if (typeof window !== "undefined" && data)
					await putEntityInCache("areas-iluminacion-cache", data)
				return data
			} catch (error) {
				if (typeof window !== "undefined" && !navigator.onLine) {
					const cached = await getCachedEntityById(
						"areas-iluminacion-cache",
						areaId
					)
					if (cached) return cached
				}
				throw error
			}
		},
		enabled: !!areaId,
		networkMode: "always",
		initialData: () => {
			const areaQueries = queryClient.getQueriesData<AreaIluminacionType[]>({
				queryKey: ["areas-iluminacion"],
			})
			const areas = areaQueries.flatMap(([, data]) => data ?? [])
			return areas?.find(item => item.id === areaId)
		},
	})
}
