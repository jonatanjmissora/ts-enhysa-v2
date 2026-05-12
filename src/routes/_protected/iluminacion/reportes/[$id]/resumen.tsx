import Loading from "#/components/loading"
import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { Suspense } from "react"
import { reporteQueryOptions } from "../../../../../../queries/reportes/iluminacion/reportes-query"
import Title from "#/components/title"

export const Route = createFileRoute(
	"/_protected/iluminacion/reportes/$id/resumen"
)({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<Suspense fallback={<Loading text="obteniendo resumen" />}>
			<Resumen />
		</Suspense>
	)
}

function Resumen() {
	const { id } = Route.useParams()
	const { data: reporte } = useSuspenseQuery(reporteQueryOptions({ id }))

	return (
		<article className="min-h-screen w-5/6 mx-auto flex flex-col gap-14 my-14 tracking-wider">
			<div className="flex flex-col justify-center items-center gap-3">
				<Title text="Conclusiones Finales" />
				<span className="text-sm text-pretty italic">
					{reporte?.conclusion}
				</span>
			</div>

			<div className="flex flex-col justify-center items-center gap-3">
				<Title text="Observaciones Generales" />
				<span className="text-sm text-pretty italic">
					{reporte?.observacion}
				</span>
			</div>

			<div className="flex flex-col justify-center items-center gap-3">
				<Title text="Recomendaciones" />
				<span className="text-sm text-pretty italic">
					{reporte?.recomendacion}
				</span>
			</div>
		</article>
	)
}
