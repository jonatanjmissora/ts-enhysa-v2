import { queryOptions, useQueryClient } from "@tanstack/react-query"
import { getReportesServer } from "../../../server/reportes/iluminacion/get-reportes-server"
import { getReporteNuevoServer } from "../../../server/reportes/iluminacion/get-reporte-nuevo-server"
import { getReporteServer } from "../../../server/reportes/iluminacion/get-reporte-server"
import type { ReporteIluminacionType } from "../../../db/reportes/iluminacion/schema"

export const reportesQueryOptions = queryOptions({
	queryKey: ["reportes-iluminacion"],
	queryFn: () => getReportesServer(),
})

export const reporteNuevoQueryOptions = () => {
	const queryClient = useQueryClient()
	return queryOptions({
		queryKey: ["reporte-iluminacion-nuevo"],
		queryFn: () => getReporteNuevoServer(),
		initialData: () => {
			const reportes = queryClient.getQueryData<ReporteIluminacionType[]>([
				"reportes-iluminacion",
			])
			return reportes?.find(item => !item.finishedAt)
		},
	})
}

export const reporteQueryOptions = ({ id }: { id: string }) => {
	return queryOptions({
		queryKey: ["reporte-iluminacion", id],
		queryFn: () => getReporteServer({ data: { id } }),
	})
}
