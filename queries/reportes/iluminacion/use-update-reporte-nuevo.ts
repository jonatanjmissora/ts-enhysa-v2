import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { ReporteIluminacionType } from "../../../db/reportes/iluminacion/schema"
import { updateReporteNuevoServer } from "../../../server/reportes/iluminacion/update-reporte-nuevo-server"

export function useUpdateReporteNuevo() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: updateReporteNuevoServer,
		onSuccess: data => {
			queryClient.setQueryData<ReporteIluminacionType>(
				["reportes-iluminacion-nuevo"],
				data
			)
		},
	})
}
