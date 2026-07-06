import { queryOptions, useQueryClient } from "@tanstack/react-query"
import { getReportesServer } from "../../../server/reportes/iluminacion/get-reportes-server"
import { getReporteNuevoServer } from "../../../server/reportes/iluminacion/get-reporte-nuevo-server"
import { getReporteServer } from "../../../server/reportes/iluminacion/get-reporte-server"
import type { ReporteIluminacionType } from "../../../db/reportes/iluminacion/schema"
import { OfflineNoCacheError } from "@/lib/offline/errors"
import {
	getCachedEntityById,
	getCachedEntityList,
	putEntityInCache,
	saveEntityListToCache,
} from "@/lib/offline/db"

const isClient = typeof window !== "undefined"

export const reportesQueryOptions = queryOptions({
	queryKey: ["reportes-iluminacion"],
	queryFn: async () => {
		try {
			const data = await getReportesServer()
			if (isClient && data)
				await saveEntityListToCache("reportes-iluminacion-cache", data)
			return data
		} catch {
			if (!isClient) throw new OfflineNoCacheError()
			const cached = await getCachedEntityList("reportes-iluminacion-cache")
			if (cached.length === 0) throw new OfflineNoCacheError()
			return cached
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
				if (isClient && data)
					await putEntityInCache("reportes-iluminacion-cache", data)
				return data
			} catch {
				if (!isClient) throw new OfflineNoCacheError()
				const cached = await getCachedEntityList("reportes-iluminacion-cache")
				const draft = cached.find(item => !item.finishedAt)
				if (!draft) throw new OfflineNoCacheError()
				return draft
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
				if (isClient && data)
					await putEntityInCache("reportes-iluminacion-cache", data)
				return data
			} catch {
				if (!isClient) throw new OfflineNoCacheError()
				const cached = await getCachedEntityById(
					"reportes-iluminacion-cache",
					id
				)
				if (!cached) throw new OfflineNoCacheError()
				return cached
			}
		},
		networkMode: "always",
	})
}
