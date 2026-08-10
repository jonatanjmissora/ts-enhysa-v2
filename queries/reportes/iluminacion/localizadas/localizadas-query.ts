import { queryOptions, useQueryClient } from "@tanstack/react-query"
import { getLocalizadasServer } from "../../../../server/reportes/iluminacion/localizadas/get-localizadas-server"
import { getLocalizadaServer } from "../../../../server/reportes/iluminacion/localizadas/get-localizada-server"
import type { LocalizadaIluminacionType } from "../../../../db/reportes/iluminacion/localizadas/schema"

export const localizadasQueryOptions = ({ reportId }: { reportId: string }) =>
	queryOptions({
		queryKey: ["localizadas-iluminacion", reportId],
		queryFn: () => getLocalizadasServer({ data: { reportId } }),
		enabled: !!reportId,
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
			const localizadaQueries = queryClient.getQueriesData<
				LocalizadaIluminacionType[]
			>({ queryKey: ["localizadas-iluminacion"] })
			const localizadas = localizadaQueries.flatMap(([, data]) => data ?? [])
			return localizadas?.find(item => item.id === localizadaId)
		},
	})
}
