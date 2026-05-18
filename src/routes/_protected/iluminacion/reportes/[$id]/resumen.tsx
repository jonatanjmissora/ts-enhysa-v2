import Loading from "#/components/loading"
import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute, Link } from "@tanstack/react-router"
import { Suspense } from "react"
import { reporteQueryOptions } from "../../../../../../queries/reportes/iluminacion/reportes-query"
import Title from "#/components/title"
import { Button } from "#/components/ui/button"

export const Route = createFileRoute(
	"/_protected/iluminacion/reportes/$id/resumen"
)({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<Suspense
			fallback={
				<Loading
					text="obteniendo resumen"
					className="scale-50 justify-start  max-h-[50svh]"
				/>
			}
		>
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

			<Link
				to="/iluminacion/reportes/pdf/$id"
				params={{ id }}
				className="w-full flex justify-center"
			>
				<Button className="rounded-lg mt-20 py-5 w-5/6 sm:w-1/2 mx-auto">
					Generar el PDF
				</Button>
			</Link>
		</article>
	)
}
