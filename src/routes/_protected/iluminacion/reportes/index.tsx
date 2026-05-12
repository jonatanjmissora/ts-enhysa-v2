import BackChevron from "#/components/back-chevron"
import Loading from "#/components/loading"
import Title from "#/components/title"
import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute, Link } from "@tanstack/react-router"
import { Suspense } from "react"
import { reportesQueryOptions } from "../../../../../queries/reportes/iluminacion/reportes-query"

export const Route = createFileRoute("/_protected/iluminacion/reportes/")({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<article className="w-full min-h-svh flex flex-col items-center gap-0 relative mb-60">
			<BackChevron to="/iluminacion" />
			<Title text="Reportes Iluminación" className="mt-15" />
			<IluminacionReportes />
		</article>
	)
}

function IluminacionReportes() {
	return (
		<Suspense
			fallback={
				<Loading
					text="obteniendo reportes..."
					className="scale-50 justify-start  max-h-[50svh] "
				/>
			}
		>
			<ReportesIluminacion />
		</Suspense>
	)
}

function ReportesIluminacion() {
	const { data: reportes } = useSuspenseQuery(reportesQueryOptions)

	return (
		<article className="w-5/6 flex flex-col gap-2 mt-20">
			{reportes?.map(reporte => (
				<Link
					key={reporte.id}
					to="/iluminacion/reportes/$id"
					params={{ id: reporte.id }}
				>
					{reporte.id}
				</Link>
			))}
		</article>
	)
}
