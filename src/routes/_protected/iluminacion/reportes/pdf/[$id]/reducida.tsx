import BackChevron from "#/components/back-chevron"
import Loading from "#/components/loading"
import Title from "#/components/title"
import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { Suspense } from "react"
import { reporteQueryOptions } from "../../../../../../../queries/reportes/iluminacion/reportes-query"
import { ClientComponent } from "#/components/client-component"
import { lazy } from "react"
const MyDocumentReducida = lazy(() =>
	import("#/components/reportes/iluminacion/pdf/my-document-reducida").then(
		m => ({
			default: m.MyDocumentReducida,
		})
	)
)
import { areasQueryOptions } from "../../../../../../../queries/reportes/iluminacion/areas/areas-query"
import useScrollTop from "#/hooks/scroll-top"

export const Route = createFileRoute(
	"/_protected/iluminacion/reportes/pdf/$id/reducida"
)({
	component: RouteComponent,
})

function RouteComponent() {
	useScrollTop()
	return (
		<article className="w-full min-h-svh flex flex-col items-center gap-0 relative mb-60">
			<BackChevron to="/iluminacion/reportes" />
			<div className="flex flex-col gap-0 items-center justify-center w-full mb-12">
				<Title text="Reporte Iluminación PDF" className="mt-15" />
				<Suspense
					fallback={<span className="text-muted-foreground">. . .</span>}
				>
					<Empresa />
				</Suspense>
			</div>
			<Suspense
				fallback={
					<Loading
						text="obteniendo reporte..."
						className="scale-50 justify-start  max-h-[50svh]"
					/>
				}
			>
				<PDF />
			</Suspense>
		</article>
	)
}

function Empresa() {
	const { id } = Route.useParams()
	const { data: reporte } = useSuspenseQuery({
		...reporteQueryOptions({ id }),
		staleTime: 1000 * 60 * 5, // 5 minutos
	})
	return (
		<span className="text-amber-600">{`${reporte?.empresa.razonSocial.toUpperCase()} - ${reporte?.finishedAt?.toLocaleDateString("it-IT")}`}</span>
	)
}

function PDF() {
	const { id } = Route.useParams()
	const { data: reporte } = useSuspenseQuery({
		...reporteQueryOptions({ id }),
		staleTime: 1000 * 60 * 5, // 5 minutos
	})
	const { data: areas } = useSuspenseQuery({
		...areasQueryOptions({ reporteId: reporte?.id || "" }),
		staleTime: 1000 * 60 * 5,
	})

	if (!reporte)
		return <span className="text-red-500">Reporte no encontrado</span>

	return (
		<ClientComponent
			fallback={
				<Loading
					text="preparando entorno..."
					className="scale-50 justify-start  max-h-[50svh]"
				/>
			}
		>
			<Suspense
				fallback={
					<Loading
						text="cargando módulo pdf..."
						className="scale-50 justify-start max-h-[50svh]"
					/>
				}
			>
				<MyDocumentReducida
					reporte={reporte}
					areas={areas}
					tecnico={reporte.tecnico}
					empresa={reporte.empresa}
					instrumento={reporte.instrumento}
				/>
			</Suspense>
		</ClientComponent>
	)
}
