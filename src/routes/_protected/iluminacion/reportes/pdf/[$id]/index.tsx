import BackChevron from "#/components/back-chevron"
import Loading from "#/components/loading"
import Title from "#/components/title"
import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { Suspense } from "react"
import { reporteQueryOptions } from "../../../../../../../queries/reportes/iluminacion/reportes-query"
import { ClientComponent } from "#/components/client-component"
import { MyDocument } from "#/components/reportes/iluminacion/pdf/my-document"
import { areasQueryOptions } from "../../../../../../../queries/reportes/iluminacion/areas/areas-query"
import useScrollTop from "#/hooks/scroll-top"

export const Route = createFileRoute(
	"/_protected/iluminacion/reportes/pdf/$id/"
)({
	component: RouteComponent,
})

function RouteComponent() {
	useScrollTop()
	return (
		<Suspense
			fallback={
				<Loading
					text="obteniendo reporte"
					className="scale-50 justify-start  max-h-[50svh]"
				/>
			}
		>
			<PDF />
		</Suspense>
	)
}

function PDF() {
	const { id } = Route.useParams()
	const { data: reporte } = useSuspenseQuery(reporteQueryOptions({ id }))
	const { data: areas } = useSuspenseQuery(
		areasQueryOptions({ reportId: reporte?.id || "" })
	)

	if (!reporte)
		return <span className="text-red-500">Reporte no encontrado</span>

	return (
		<article className="w-full flex flex-col gap-10 tracking-wider my-14">
			<div className="min-h-svh w-full relative flex flex-col items-center gap-10">
				<BackChevron to="/iluminacion/reportes" />
				<div className="flex flex-col gap-0 items-center justify-center w-full">
					<Title text="Reporte Iluminación PDF" className="mt-15" />
					<span className="text-amber-600">{`${reporte.empresa.razonSocial.toUpperCase()} - ${reporte.finishedAt?.toLocaleDateString("it-IT")}`}</span>
				</div>
				{/* <ClientComponent
					fallback={
						<span className="italic textL text-foreground/50 w-full h-[30svh] flex items-center justify-center">
							Cargando visor de PDF...
						</span>
					}
				> */}
				<MyDocument
					reporte={reporte}
					areas={areas}
					tecnico={reporte.tecnico}
					empresa={reporte.empresa}
					instrumento={reporte.instrumento}
				/>
				{/* </ClientComponent> */}
			</div>
		</article>
	)
}
