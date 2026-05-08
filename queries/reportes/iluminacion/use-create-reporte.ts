import { useMutation, useQueryClient } from "@tanstack/react-query"
import { sortedByDate } from "#/lib/utils"
import type { ReporteIluminacionType } from "../../../db/schema"
import {
	createNuevoReporteServer,
	createReporteServer,
} from "../../../server/reportes/iluminacion/create-reporte-server"

export function useCreateNuevoReporte() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: createNuevoReporteServer,
		onSuccess: data => {
			// queryClient.invalidateQueries({ queryKey: ["empresas"] })
			queryClient.setQueryData<ReporteIluminacionType[]>(
				["nuevo-reporte-iluminacion"],
				oldData => {
					if (!oldData) return oldData
					return sortedByDate([data, ...oldData])
				}
			)
		},
	})
}

export function useCreateReporte() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: createReporteServer,
		onSuccess: data => {
			// queryClient.invalidateQueries({ queryKey: ["empresas"] })
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
