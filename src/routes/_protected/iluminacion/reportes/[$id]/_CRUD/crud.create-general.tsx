import BackChevron from "#/components/back-chevron"
import Loading from "#/components/loading"
import Title from "#/components/title"
import useScrollTop from "#/hooks/scroll-top"
import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute, Link } from "@tanstack/react-router"
import { Suspense } from "react"
import { reportesQueryOptions } from "../../../../../../../queries/reportes/iluminacion/reportes-query"
import type { ReporteIluminacionType } from "../../../../../../../db/reportes/iluminacion/schema"
import { TriangleAlert } from "lucide-react"
import { Button } from "#/components/ui/button"
import DeleteReporteNuevo from "#/components/reportes/iluminacion/nuevo-informe/delete-reporte-nuevo"
import CreateReporteNuevo from "#/components/reportes/iluminacion/nuevo-informe/create-reporte-nuevo"

export const Route = createFileRoute(
	"/_protected/iluminacion/reportes/$id/_CRUD/crud/create-general"
)({
	component: RouteComponent,
})

function RouteComponent() {
	useScrollTop()

	return (
		<article className="w-full min-h-svh flex flex-col items-center gap-10 relative mb-60">
			<BackChevron to="/iluminacion/reportes" />
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
	const { data: reportes } = useSuspenseQuery(reportesQueryOptions)

	const reporteNuevo = reportes?.find(r => !r.finishedAt)

	if (reporteNuevo) return <ReporteEnCurso reporteNuevo={reporteNuevo} />

	return <CreateReporteNuevo />
}

function ReporteEnCurso({
	reporteNuevo,
}: {
	reporteNuevo: ReporteIluminacionType
}) {
	return (
		<article className="flex flex-col gap-10 items-center justify-center">
			<div className="flex flex-col justify-center items-center gap-3">
				<TriangleAlert className="size-16 dark:text-amber-500 text-amber-700/70" />
				<span className="tracking-wider text-lg">Atención</span>
			</div>
			<span className="tracking-widest text-center text-pretty w-5/6 mx-auto italic text-foreground/50">
				¿Existe un reporte en curso, desea continuarlo o crear uno nuevo?
			</span>

			<span className="text-sm tracking-widest text-center text-pretty w-5/6 mx-auto italic text-amber-700/70 dark:text-amber-500/50">
				No se podrá recuperar la información una vez eliminada.
			</span>

			<div className="flex flex-col gap-4 sm:flex-row w-5/6 mx-auto">
				<Link
					to="/iluminacion/reportes/$id/crud/edit-general"
					params={{
						id: reporteNuevo.id,
					}}
					className="w-full sm:flex-1"
				>
					<Button variant="outline" className="py-6 w-full sm:flex-1">
						Continuar Reporte
					</Button>
				</Link>
				<DeleteReporteNuevo reporteNuevo={reporteNuevo} />
			</div>
		</article>
	)
}
