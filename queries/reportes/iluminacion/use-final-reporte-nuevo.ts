import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateReporteServer } from "../../../server/reportes/iluminacion/update-reporte-server"
import type { ReporteIluminacionType } from "../../../db/reportes/iluminacion/schema"

export function useFinalReporteNuevo() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: updateReporteServer,

		onSuccess: data => {
			if (!data) return
			queryClient.removeQueries({ queryKey: ["reporte-iluminacion-nuevo"] })
			queryClient.setQueryData<ReporteIluminacionType>(
				["reporte-iluminacion", data.id],
				data
			)
			queryClient.setQueryData<ReporteIluminacionType[]>(
				["reportes-iluminacion"],
				oldData => {
					if (!oldData) return oldData
					return oldData.map(oldReporte =>
						oldReporte.id === data.id ? data : oldReporte
					)
				}
			)
		},
	})
}
