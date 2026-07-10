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
import { OfflineNoCacheError } from "@/lib/offline/errors"

export const areasQueryOptions = ({ reportId }: { reportId: string }) =>
	queryOptions({
		queryKey: ["areas-iluminacion", reportId],
		queryFn: async () => {
			try {
				const data = await getAreasServer({ data: { reportId } })
				if (typeof window !== "undefined" && data)
					await saveEntityListToCache("areas-iluminacion-cache", data)
				return data
			} catch {
				if (typeof window !== "undefined") {
					const cached = await getCachedEntitiesByField(
						"areas-iluminacion-cache",
						"reportId",
						reportId
					)
					if (cached.length > 0) return cached
				}
				throw new OfflineNoCacheError()
			}
		},
		enabled: !!reportId,
		networkMode: "always",
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
			} catch {
				if (typeof window !== "undefined") {
					const cached = await getCachedEntityById(
						"areas-iluminacion-cache",
						areaId
					)
					if (cached) return cached
				}
				throw new OfflineNoCacheError()
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
