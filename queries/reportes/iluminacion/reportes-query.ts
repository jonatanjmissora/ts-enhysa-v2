import { queryOptions, useQueryClient } from "@tanstack/react-query"
import { getReportesServer } from "../../../server/reportes/iluminacion/get-reportes-server"
import { getReporteNuevoServer } from "../../../server/reportes/iluminacion/get-reporte-nuevo-server"
import { getReporteServer } from "../../../server/reportes/iluminacion/get-reporte-server"
import type { ReporteIluminacionType } from "../../../db/reportes/iluminacion/schema"
import { OfflineNoCacheError } from "@/lib/offline/errors"

const isClient = typeof window !== "undefined"

export const reportesQueryOptions = queryOptions({
	queryKey: ["reportes-iluminacion"],
	queryFn: async () => {
		try {
			return await getReportesServer()
		} catch {
			if (isClient && !navigator.onLine) throw new OfflineNoCacheError()
			throw new Error("Error al cargar reportes")
		}
	},
	// refetchInterval: 60 * 1000, // refrescar cada 60 segundos
})

export const reporteNuevoQueryOptions = () => {
	const queryClient = useQueryClient()
	return queryOptions({
		queryKey: ["reporte-iluminacion-nuevo"],
		queryFn: async () => {
			try {
				return await getReporteNuevoServer()
			} catch {
				if (isClient && !navigator.onLine) throw new OfflineNoCacheError()
				throw new Error("Error al cargar reporte en curso")
			}
		},
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
				return await getReporteServer({ data: { id } })
			} catch {
				if (isClient && !navigator.onLine) throw new OfflineNoCacheError()
				throw new Error("Error al cargar el reporte")
			}
		},
	})
}
