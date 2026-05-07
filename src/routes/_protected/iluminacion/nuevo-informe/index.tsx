import BackChevron from "#/components/back-chevron"
import Loading from "#/components/loading"
import Title from "#/components/title"
import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { Suspense } from "react"
import { reportesQueryOptions } from "../../../../../queries/reportes/iluminacion/reportes-query"

export const Route = createFileRoute("/_protected/iluminacion/nuevo-informe/")({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<article className="w-full min-h-svh flex flex-col items-center gap-20 relative">
			<BackChevron />
			<Title text="Nuevo Informe" className="mt-15" />
			<IluminacionData />
		</article>
	)
}

function IluminacionData() {
	return (
		<Suspense
			fallback={<Loading className="scale-50 justify-start  max-h-[50svh] " />}
		>
			<Data />
		</Suspense>
	)
}

function Data() {
	const { data: reportes } = useSuspenseQuery(reportesQueryOptions)

	if (!reportes || reportes.length === 0) return <ReporteIluminacionNuevo />

	return <ReporteEnCurso />
}

function ReporteEnCurso() {
	return (
		<div className="w-full h-full flex flex-col items-center justify-center gap-20 relative">
			<h1>Informe en Curso</h1>
		</div>
	)
}

function ReporteIluminacionNuevo() {
	return (
		<div className="w-full h-full flex flex-col items-center justify-center gap-20 relative">
			<h1>Nuevo Informe</h1>
		</div>
	)
}
