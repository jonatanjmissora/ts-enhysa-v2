import { queryOptions, useQueryClient } from "@tanstack/react-query"
import { getLocalizadasServer } from "../../../../server/reportes/iluminacion/localizadas/get-localizadas-server"
import { getLocalizadaServer } from "../../../../server/reportes/iluminacion/localizadas/get-localizada-server"
import type { LocalizadaIluminacionType } from "../../../../db/reportes/iluminacion/localizadas/schema"
import { OfflineNoCacheError } from "@/lib/offline/errors"

const isClient = typeof window !== "undefined"

export const localizadasQueryOptions = ({ reportId }: { reportId: string }) =>
	queryOptions({
		queryKey: ["localizadas-iluminacion", reportId],
		queryFn: async () => {
			try {
				return await getLocalizadasServer({ data: { reportId } })
			} catch {
				if (isClient && !navigator.onLine) throw new OfflineNoCacheError()
				throw new Error("Error al cargar localizadas")
			}
		},
		enabled: !!reportId,
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
				return await getLocalizadaServer({ data: { localizadaId } })
			} catch {
				if (isClient && !navigator.onLine) throw new OfflineNoCacheError()
				throw new Error("Error al cargar la localizada")
			}
		},
		enabled: !!localizadaId,
		initialData: () => {
			const localizadas = queryClient.getQueryData<LocalizadaIluminacionType[]>(
				["localizadas-iluminacion"]
			)
			return localizadas?.find(item => item.id === localizadaId)
		},
	})
}
