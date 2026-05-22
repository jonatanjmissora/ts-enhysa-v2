import { useMutation, useQueryClient } from "@tanstack/react-query"
import { sortedByDate } from "#/lib/utils"
import type { ReporteIluminacionType } from "../../../db/schema"
import {
	createReporteNuevoServer,
} from "../../../server/reportes/iluminacion/create-reporte-nuevo-server"

export function useCreateReporteNuevo() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: createReporteNuevoServer,
		onSuccess: data => {
			// queryClient.invalidateQueries({ queryKey: ["empresas"] })
			queryClient.setQueryData<ReporteIluminacionType[]>(
				["reporte-iluminacion-nuevo"],
				oldData => {
					if (!oldData) return oldData
					return sortedByDate([data, ...oldData])
				}
			)
			queryClient.setQueryData<ReporteIluminacionType[]>(
				["reportes-iluminacion"],
				oldData => {
					if (!oldData) return oldData
					return sortedByDate([data, ...oldData])
				}
			)
		},
	})
}

// export function useCreateReporte() {
// 	const queryClient = useQueryClient()

// 	return useMutation({
// 		mutationFn: createReporteServer,
// 		onSuccess: data => {
// 			// queryClient.invalidateQueries({ queryKey: ["empresas"] })
// 			queryClient.setQueryData<ReporteIluminacionType>(
// 				["reporte-iluminacion", data.id],
// 				data
// 			)
// 			queryClient.setQueryData<ReporteIluminacionType[]>(
// 				["reportes-iluminacion"],
// 				oldData => {
// 					if (!oldData) return oldData
// 					return sortedByDate([data, ...oldData])
// 				}
// 			)
// 		},
// 	})
// }
