import { queryOptions, useQueryClient } from "@tanstack/react-query"
import { getAreasServer } from "../../../../server/reportes/iluminacion/areas/get-areas-server"
import { getAreaServer } from "../../../../server/reportes/iluminacion/areas/get-area-server"
import type { AreaIluminacionType } from "../../../../db/reportes/iluminacion/areas/schema"
import { OfflineNoCacheError } from "@/lib/offline/errors"

const isClient = typeof window !== "undefined"

export const areasQueryOptions = ({ reportId }: { reportId: string }) =>
	queryOptions({
		queryKey: ["areas-iluminacion", reportId],
		queryFn: async () => {
			try {
				return await getAreasServer({ data: { reportId } })
			} catch {
				if (isClient && !navigator.onLine) throw new OfflineNoCacheError()
				throw new Error("Error al cargar áreas")
			}
		},
		enabled: !!reportId,
		// refetchInterval: 60 * 1000, // refrescar cada 60 segundos
	})

export const areaQueryOptions = ({ areaId }: { areaId: string }) => {
	const queryClient = useQueryClient()
	return queryOptions({
		queryKey: ["area-iluminacion", areaId],
		queryFn: async () => {
			try {
				return await getAreaServer({ data: { areaId } })
			} catch {
				if (isClient && !navigator.onLine) throw new OfflineNoCacheError()
				throw new Error("Error al cargar el área")
			}
		},
		enabled: !!areaId,
		initialData: () => {
			const areas = queryClient.getQueryData<AreaIluminacionType[]>([
				"areas-iluminacion",
			])
			return areas?.find(item => item.id === areaId)
		},
	})
}
