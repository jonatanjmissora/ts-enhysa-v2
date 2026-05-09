import BackChevron from "#/components/back-chevron"
import Loading from "#/components/loading"
import Title from "#/components/title"
import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { Suspense } from "react"
import { reporteNuevoQueryOptions } from "../../../../../queries/reportes/iluminacion/reportes-query"
import ReporteNuevoIluminacion from "#/components/reportes/iluminacion/reporte-nuevo"
import ReporteEnCurso from "#/components/reportes/iluminacion/reporte-en-curso"
import useScrollTop from "#/hooks/scroll-top"

export const Route = createFileRoute("/_protected/iluminacion/nuevo-informe/")({
	component: RouteComponent,
})

function RouteComponent() {
	useScrollTop()

	return (
		<article className="w-full min-h-svh flex flex-col items-center gap-10 relative mb-60">
			<BackChevron to="/iluminacion" />
			<Title text="Nuevo Informe" className="mt-15" />
			<IluminacionData />
		</article>
	)
}

function IluminacionData() {
	return (
		<Suspense
			fallback={
				<Loading
					text="verificando reporte en curso..."
					className="scale-50 justify-start  max-h-[50svh] "
				/>
			}
		>
			<Data />
		</Suspense>
	)
}

function Data() {
	const { data: reporteNuevo } = useSuspenseQuery(reporteNuevoQueryOptions)

	if (!reporteNuevo) return <ReporteNuevoIluminacion />

	return <ReporteEnCurso reporteNuevo={reporteNuevo} />
}
