import { queryOptions, useQueryClient } from "@tanstack/react-query"
import { getLocalizadasServer } from "../../../../server/reportes/iluminacion/localizadas/get-localizadas-server"
import { getLocalizadaServer } from "../../../../server/reportes/iluminacion/localizadas/get-localizada-server"
import type { LocalizadaIluminacionType } from "../../../../db/reportes/iluminacion/localizadas/schema"
import {
	getCachedEntitiesByField,
	getCachedEntityById,
	putEntityInCache,
	saveEntityListToCache,
} from "@/lib/offline/db"

export const localizadasQueryOptions = ({ reportId }: { reportId: string }) =>
	queryOptions({
		queryKey: ["localizadas-iluminacion", reportId],
		queryFn: async () => {
			try {
				const data = await getLocalizadasServer({ data: { reportId } })
				if (typeof window !== "undefined" && data)
					await saveEntityListToCache("localizadas-iluminacion-cache", data)
				return data
			} catch (error) {
				if (typeof window !== "undefined" && !navigator.onLine) {
					const cached = await getCachedEntitiesByField(
						"localizadas-iluminacion-cache",
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

export const localizadaQueryOptions = ({
	localizadaId,
}: {
	localizadaId: string
}) => {
	const queryClient = useQueryClient()
	return queryOptions({
		queryKey: ["localizada-iluminacion", localizadaId],
		queryFn: async () => {
			try {
				const data = await getLocalizadaServer({ data: { localizadaId } })
				if (typeof window !== "undefined" && data)
					await putEntityInCache("localizadas-iluminacion-cache", data)
				return data
			} catch (error) {
				if (typeof window !== "undefined" && !navigator.onLine) {
					const cached = await getCachedEntityById(
						"localizadas-iluminacion-cache",
						localizadaId
					)
					if (cached) return cached
				}
				throw error
			}
		},
		enabled: !!localizadaId,
		networkMode: "always",
		initialData: () => {
			const localizadaQueries = queryClient.getQueriesData<
				LocalizadaIluminacionType[]
			>({ queryKey: ["localizadas-iluminacion"] })
			const localizadas = localizadaQueries.flatMap(([, data]) => data ?? [])
			return localizadas?.find(item => item.id === localizadaId)
		},
	})
}
