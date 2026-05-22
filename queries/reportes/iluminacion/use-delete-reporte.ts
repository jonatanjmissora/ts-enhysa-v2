import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteReporteServer } from "../../../server/reportes/iluminacion/delete-reporte-server"
import type { ReporteIluminacionType } from "../../../db/reportes/iluminacion/schema"

export function useDeleteReporteNuevo(reporteId: string) {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ data }: { data: { id: string } }) =>
			deleteReporteServer({ data }),
		onSuccess: () => {
			queryClient.setQueryData(["reporte-iluminacion-nuevo"], null)
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
