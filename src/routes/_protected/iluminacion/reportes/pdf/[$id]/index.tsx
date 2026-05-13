import BackChevron from "#/components/back-chevron"
import Loading from "#/components/loading"
import Title from "#/components/title"
import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { Suspense } from "react"
import { reporteQueryOptions } from "../../../../../../../queries/reportes/iluminacion/reportes-query"
import { ClientComponent } from "#/components/client-component"
import { MyDocument } from "#/components/reportes/iluminacion/pdf/my-document"

// const PDFViewLazy = lazy(
// 	() =>
// 		import(
// 			"../../../../../../components/reportes/iluminacion/pdf/pdf-view-lazy.tsx"
// 		)
// )

export const Route = createFileRoute(
	"/_protected/iluminacion/reportes/pdf/$id/"
)({
	component: RouteComponent,
})

function RouteComponent() {
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

	if (!reporte)
		return <span className="text-red-500">Reporte no encontrado</span>

	return (
		<article className="min-h-screen w-5/6 mx-auto flex flex-col gap-10 tracking-wider my-14">
			<div className="min-h-svh w-full relative flex flex-col items-center gap-10">
				<BackChevron to="/iluminacion/reportes" />
				<Title text="Reporte Iluminación PDF" className="mt-15" />
				<ClientComponent
					fallback={
						<span className="italic textL text-foreground/50 w-full h-[30svh] flex items-center justify-center">
							Cargando visor de PDF...
						</span>
					}
				>
					<MyDocument reporte={reporte} />
					{/* <Suspense fallback={<span>Cargando PDF...</span>}>
						<PDFViewLazy reporte={reporte} />
					</Suspense> */}
				</ClientComponent>
			</div>
		</article>
	)
}
