import { queryOptions, useQueryClient } from "@tanstack/react-query"
import { getReportesServer } from "../../../server/reportes/iluminacion/get-reportes-server"
import { getReporteNuevoServer } from "../../../server/reportes/iluminacion/get-reporte-nuevo-server"
import { getReporteServer } from "../../../server/reportes/iluminacion/get-reporte-server"
import type { ReporteIluminacionType } from "../../../db/reportes/iluminacion/schema"
import {
	getCachedEntityById,
	getCachedEntityList,
	putEntityInCache,
	saveEntityListToCache,
} from "@/lib/offline/db"

export const reportesQueryOptions = queryOptions({
	queryKey: ["reportes-iluminacion"],
	queryFn: async () => {
		try {
			const data = await getReportesServer()
			if (typeof window !== "undefined" && data)
				await saveEntityListToCache("reportes-iluminacion-cache", data)
			return data
		} catch (error) {
			if (typeof window !== "undefined" && !navigator.onLine) {
				const cached = await getCachedEntityList("reportes-iluminacion-cache")
				if (cached.length > 0) return cached
			}
			throw error
		}
	},
	networkMode: "always",
	// refetchInterval: 60 * 1000, // refrescar cada 60 segundos
})

export const reporteNuevoQueryOptions = () => {
	const queryClient = useQueryClient()
	return queryOptions({
		queryKey: ["reporte-iluminacion-nuevo"],
		queryFn: async () => {
			try {
				const data = await getReporteNuevoServer()
				if (typeof window !== "undefined" && data)
					await putEntityInCache("reportes-iluminacion-cache", data)
				return data
			} catch (error) {
				if (typeof window !== "undefined" && !navigator.onLine) {
					const cached = await getCachedEntityList("reportes-iluminacion-cache")
					const draft = cached.find(item => !item.finishedAt)
					if (draft) return draft
				}
				throw error
			}
		},
		networkMode: "always",
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
		queryFn: async () => {
			try {
				const data = await getReporteServer({ data: { id } })
				if (typeof window !== "undefined" && data)
					await putEntityInCache("reportes-iluminacion-cache", data)
				return data
			} catch (error) {
				if (typeof window !== "undefined" && !navigator.onLine) {
					const cached = await getCachedEntityById(
						"reportes-iluminacion-cache",
						id
					)
					if (cached) return cached
				}
				throw error
			}
		},
		networkMode: "always",
	})
}
