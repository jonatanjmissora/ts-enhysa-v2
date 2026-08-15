import BackChevron from "#/components/back-chevron"
import Loading from "#/components/loading"
import Title from "#/components/title"
import {
	useSuspenseQuery,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { Suspense, lazy, useEffect } from "react"
import { syncPendingPaymentsServer } from "../../../../../../../server/mercadopago/sync-pending-payments-server"
import { reporteQueryOptions } from "../../../../../../../queries/reportes/iluminacion/reportes-query"
import { ClientComponent } from "#/components/client-component"
const MyDocumentReducida = lazy(() =>
	import("#/components/reportes/iluminacion/pdf/my-document-reducida").then(
		m => ({
			default: m.MyDocumentReducida,
		})
	)
)
import { areasQueryOptions } from "../../../../../../../queries/reportes/iluminacion/areas/areas-query"
import useScrollTop from "#/hooks/scroll-top"
import { localizadasQueryOptions } from "../../../../../../../queries/reportes/iluminacion/localizadas/localizadas-query"
import type { TecnicoType } from "../../../../../../../db/tecnicos/schema"
import type { EmpresaType } from "../../../../../../../db/empresas/schema"
import type { InstrumentoType } from "../../../../../../../db/instrumentos/schema"
import type { ReporteIluminacionType } from "../../../../../../../db/reportes/iluminacion/schema"
import { userCreditsOptions } from "../../../../../../../queries/credits/user-credits-query"

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
				<Title text="Informe Iluminación PDF" className="mt-15" />
				<Suspense
					fallback={<span className="text-foreground-soft">. . .</span>}
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
	const reporteConRelaciones = reporte as ReporteIluminacionType & {
		empresa: EmpresaType
		tecnico: TecnicoType
		instrumento: InstrumentoType
	}
	return (
		<span className="text-amber-600">
			{reporteConRelaciones?.empresa?.razonSocial
				? `${reporteConRelaciones.empresa.razonSocial.toUpperCase()} - ${reporte?.finishedAt?.toLocaleDateString("it-IT")}`
				: reporte?.title}
		</span>
	)
}

function PDF() {
	const { id } = Route.useParams()
	const { data: reporte } = useSuspenseQuery({
		...reporteQueryOptions({ id }),
		staleTime: 1000 * 60 * 5, // 5 minutos
	})
	const { data: localizadas } = useSuspenseQuery({
		...localizadasQueryOptions({ reportId: reporte?.id || "" }),
		staleTime: 1000 * 60 * 5,
	})
	const { data: areas } = useSuspenseQuery({
		...areasQueryOptions({ reportId: reporte?.id || "" }),
		staleTime: 1000 * 60 * 5,
	})

	const reporteConRelaciones = reporte as ReporteIluminacionType & {
		empresa: EmpresaType
		tecnico: TecnicoType
		instrumento: InstrumentoType
	}

	const { data: credits } = useQuery(userCreditsOptions)
	const queryClient = useQueryClient()
	useEffect(() => {
		syncPendingPaymentsServer().then(res => {
			if (res?.synchronized)
				queryClient.invalidateQueries({ queryKey: ["user-credits"] })
		})
	}, [queryClient.invalidateQueries])

	if (!reporte)
		return <span className="text-red-500">Reporte no encontrado</span>

	if (
		!reporteConRelaciones.empresa ||
		!reporteConRelaciones.tecnico ||
		!reporteConRelaciones.instrumento
	) {
		return (
			<p className="max-w-md text-center text-sm text-foreground-soft">
				No se pueden generar los datos del informe (empresa, técnico o
				instrumento) sin conexión. Conectate a internet y volvé a intentar.
			</p>
		)
	}

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
					key={reporte.creditConsumed ? "unlocked" : "locked"}
					reporte={reporte}
					localizadas={localizadas ?? []}
					areas={areas ?? []}
					tecnico={reporteConRelaciones.tecnico}
					empresa={reporteConRelaciones.empresa}
					instrumento={reporteConRelaciones.instrumento}
					credits={credits}
				/>
			</Suspense>
		</ClientComponent>
	)
}
