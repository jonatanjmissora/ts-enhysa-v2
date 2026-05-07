import { queryOptions, useQueryClient } from "@tanstack/react-query"
import { getReportesServer } from "../../../server/reportes/iluminacion/get-reportes-server"
import { getReporteNuevoServer } from "../../../server/reportes/iluminacion/get-reporte-nuevo-server"
import type { ReporteIluminacionType } from "../../../db/reportes/iluminacion/schema"

export const reportesQueryOptions = queryOptions({
	queryKey: ["reportes-iluminacion"],
	queryFn: () => getReportesServer(),
	// refetchInterval: 60 * 1000, // refrescar cada 60 segundos
})

export const reporteNuevoQueryOptions = (id: string) => {
	const queryClient = useQueryClient()
	return queryOptions({
		queryKey: ["reportes-iluminacion", id],

		queryFn: () => getReporteNuevoServer(),

		initialData: () => {
			const reportes = queryClient.getQueryData<ReporteIluminacionType[]>([
				"reportes-iluminacion",
			])
			return reportes?.find(item => item.id === id)
		},
	})
}
