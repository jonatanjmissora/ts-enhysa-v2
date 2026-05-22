import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { ReporteIluminacionType } from "../../../db/reportes/iluminacion/schema"
import { updateReporteServer } from "../../../server/reportes/iluminacion/update-reporte-server"

export function useUpdateReporteNuevo() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: updateReporteServer,

		onSuccess: data => {
			if (!data) return
			queryClient.setQueryData<ReporteIluminacionType[]>(
				["reporte-iluminacion-nuevo"],
				oldData => {
					if (!oldData) return oldData
					const oldReporte = oldData.find(
						oldReporte => oldReporte.id === data.id
					)
					if (!oldReporte) return oldData
					return oldData.map(oldReporte =>
						oldReporte.id === data.id ? data : oldReporte
					)
				}
			)
		},
	})
}

export function useUpdateReporte() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: updateReporteServer,

		onSuccess: data => {
			if (!data) return
			queryClient.setQueryData<ReporteIluminacionType>(
				["reporte-iluminacion", data.id],
				data
			)
			queryClient.setQueryData<ReporteIluminacionType[]>(
				["reportes-iluminacion"],
				oldData => {
					if (!oldData) return oldData
					const oldReporte = oldData.find(
						oldReporte => oldReporte.id === data.id
					)
					if (!oldReporte) return oldData
					return oldData.map(oldReporte =>
						oldReporte.id === data.id ? data : oldReporte
					)
				}
			)
		},
	})
}
