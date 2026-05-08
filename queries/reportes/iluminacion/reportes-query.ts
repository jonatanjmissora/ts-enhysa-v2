import { queryOptions } from "@tanstack/react-query"
import { getReportesServer } from "../../../server/reportes/iluminacion/get-reportes-server"
import { getReporteNuevoServer } from "../../../server/reportes/iluminacion/get-reporte-nuevo-server"

export const reportesQueryOptions = queryOptions({
	queryKey: ["reportes-iluminacion"],
	queryFn: () => getReportesServer(),
	// refetchInterval: 60 * 1000, // refrescar cada 60 segundos
})

export const reporteNuevoQueryOptions = queryOptions({
	queryKey: ["reportes-iluminacion-nuevo"],
	queryFn: () => getReporteNuevoServer(),
})
