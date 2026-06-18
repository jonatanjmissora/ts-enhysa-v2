import { queryOptions, useQueryClient } from "@tanstack/react-query"
import { getLocalizadasServer } from "../../../../server/reportes/iluminacion/localizadas/get-localizadas-server"
import { getLocalizadaServer } from "../../../../server/reportes/iluminacion/localizadas/get-localizada-server"
import type { LocalizadaIluminacionType } from "../../../../db/reportes/iluminacion/localizadas/schema"

export const localizadasQueryOptions = ({ reportId }: { reportId: string }) =>
	queryOptions({
		queryKey: ["localizadas-iluminacion", reportId],
		queryFn: () => getLocalizadasServer({ data: { reportId } }),
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
		queryFn: () => getLocalizadaServer({ data: { localizadaId } }),
		enabled: !!localizadaId,
		initialData: () => {
			const localizadas = queryClient.getQueryData<LocalizadaIluminacionType[]>(
				["localizadas-iluminacion"]
			)
			return localizadas?.find(item => item.id === localizadaId)
		},
	})
}
