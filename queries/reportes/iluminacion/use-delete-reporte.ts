import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteReporteServer } from "../../../server/reportes/iluminacion/delete-reporte-server"
import type { ReporteIluminacionType } from "../../../db/reportes/iluminacion/schema"

export function useDeleteReporteNuevo(reporteId: string) {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ data }: { data: { id: string } }) =>
			deleteReporteServer({ data }),
		onSuccess: () => {
			queryClient.removeQueries({
				queryKey: ["reporte-iluminacion-nuevo"],
			})
			queryClient.setQueryData<ReporteIluminacionType[]>(
				["reportes-iluminacion"],
				oldData => {
					if (!oldData) return oldData
					return oldData.filter(item => item.id !== reporteId)
				}
			)
		},
	})
}

export function useDeleteReporte(reporteId: string) {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ data }: { data: { id: string } }) =>
			deleteReporteServer({ data }),
		onSuccess: () => {
			queryClient.removeQueries({
				queryKey: ["reporte-iluminacion", reporteId],
			})
			queryClient.setQueryData<ReporteIluminacionType[]>(
				["reportes-iluminacion"],
				oldData => {
					if (!oldData) return oldData
					return oldData.filter(item => item.id !== reporteId)
				}
			)
		},
	})
}
