import BackChevron from "#/components/back-chevron"
import Loading from "#/components/loading"
import Title from "#/components/title"
import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { Suspense } from "react"
import { reporteQueryOptions } from "../../../../../../queries/reportes/iluminacion/reportes-query"
import { areasQueryOptions } from "../../../../../../queries/reportes/iluminacion/areas/areas-query"

export const Route = createFileRoute("/_protected/iluminacion/reportes/$id/")({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<article className="w-full min-h-svh flex flex-col items-center gap-0 relative mb-60">
			<BackChevron to="/iluminacion/reportes" />
			<Title text="Reporte Iluminación" className="mt-15" />
			<IluminacionResumen />
		</article>
	)
}

function IluminacionResumen() {
	return (
		<Suspense
			fallback={
				<Loading
					text="obteniendo reporte..."
					className="scale-50 justify-start  max-h-[50svh] "
				/>
			}
		>
			<Reporte />
		</Suspense>
	)
}

function Reporte() {
	const { id } = Route.useParams()

	const { data: reporte } = useSuspenseQuery(reporteQueryOptions({ id }))
	const { data: areas } = useSuspenseQuery(areasQueryOptions({ reportId: id }))

	if (!reporte)
		return (
			<span className="text-sm italic mt-20">
				No se encontro ningun reporte
			</span>
		)

	return (
		<div className="w-full flex flex-col gap-6 items-center">
			<span className="text-xl underline">Empresa: {reporte.empresaId}</span>
			<span className="text-lg underline"> Areas </span>
			{areas?.map(area => (
				<div key={area.id}>{area.nombre}</div>
			))}
		</div>
	)
}
