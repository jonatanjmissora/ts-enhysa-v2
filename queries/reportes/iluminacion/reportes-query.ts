import { queryOptions, useQueryClient } from "@tanstack/react-query"
import { getReporteNuevoServer } from "../../../server/reportes/iluminacion/get-reporte-nuevo-server"
import { getReporteServer } from "../../../server/reportes/iluminacion/get-reporte-server"
import type { ReporteIluminacionType } from "../../../db/reportes/iluminacion/schema"
import { reportesRepository } from "../../../repositories/reportes/iluminacion/reportes-repository"

export const reportesQueryOptions = (userId: string) =>
	queryOptions({
		queryKey: ["reportes-iluminacion", userId],
		queryFn: () => reportesRepository.get(userId),
	})

export const reporteNuevoQueryOptions = (userId: string) => {
	const queryClient = useQueryClient()
	return queryOptions({
		queryKey: ["reporte-iluminacion-nuevo"],
		queryFn: () => getReporteNuevoServer(),
		initialData: () => {
			const reportes = queryClient.getQueryData<ReporteIluminacionType[]>([
				"reportes-iluminacion",
				userId,
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
