import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteReporteNuevoServer } from "../../../server/reportes/iluminacion/delete-reporte-nuevo-server"
import type { ReporteIluminacionType } from "../../../db/reportes/iluminacion/schema"

export function useDeleteReporteNuevo(reporteId: string) {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ data }: { data: { id: string } }) =>
			deleteReporteNuevoServer({ data }),
		onSuccess: () => {
			queryClient.setQueryData(["reportes-iluminacion-nuevo"], null)
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
