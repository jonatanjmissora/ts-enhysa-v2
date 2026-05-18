import BackChevron from "#/components/back-chevron"
import Loading from "#/components/loading"
import Title from "#/components/title"
import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute, Link } from "@tanstack/react-router"
import { Suspense } from "react"
import { reportesQueryOptions } from "../../../../../queries/reportes/iluminacion/reportes-query"
import { Clock, ChevronRight, FileChartColumn } from "lucide-react"
import { Button } from "#/components/ui/button"
import type { ReporteIluminacionType } from "../../../../../db/reportes/iluminacion/schema"

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

	if (!reportes || reportes.length === 0) return <NoReports />

	return (
		<article className="w-5/6 sm:w-2/3 flex flex-col gap-14 mt-20">
			<div className="flex flex-col gap-4">
				{sortedByRecentDate(reportes)?.map(reporte => (
					<div
						key={reporte.id}
						className="px-2 py-4 rounded-lg ring-[1px] dark:ring-foreground/10 ring-foreground/50 bg-accent flex justify-between w-full"
					>
						<div className="flex gap-2 items-center">
							{reporte.finishedAt ? (
								<FileChartColumn className="size-8 text-blue-600" />
							) : (
								<Clock className="size-8 text-amber-600" />
							)}
							<div className="flex flex-col gap-0">
								<span className="text-base font-semibold w-55 truncate">
									{reporte.title.toUpperCase()}
								</span>
								{reporte.finishedAt ? (
									<span className="text-xs text-foreground/50">
										Realizado el{" "}
										{reporte.finishedAt?.toLocaleDateString("it-IT")}
									</span>
								) : (
									<span className="text-xs text-foreground/50">En curso</span>
								)}
							</div>
						</div>
						<Link
							to={
								reporte.finishedAt
									? "/iluminacion/reportes/$id/general"
									: "/iluminacion/nuevo-informe"
							}
							params={{ id: reporte.id }}
						>
							<ChevronRight className="size-8 text-foreground/50" />
						</Link>
					</div>
				))}
			</div>

			<Link
				to="/iluminacion/nuevo-informe"
				className="my-20 py-3 w-5/6 sm:w-1/2 mx-auto tracking-widest font-semibold text-base bg-primary rounded-lg flex gap-2 items-center justify-center ring-[1px] ring-foreground/25"
			>
				<FileChartColumn size={20} />
				Nuevo Informe
			</Link>
		</article>
	)
}

function NoReports() {
	return (
		<article className="w-5/6 flex flex-col items-center justify-center gap-10 mt-20">
			<span className="text-center text-foreground/70 text-sm italic tracking-wide">
				No posee informes de Iluminación. Realice su primer reporte ...
			</span>
			<Link to="/iluminacion/nuevo-informe">
				<Button>Nuevo Reporte</Button>
			</Link>
		</article>
	)
}

function sortedByRecentDate(reportes: ReporteIluminacionType[]) {
	return reportes?.sort((a, b) => (b.finishedAt || b.createdAt).getTime() - (a.finishedAt || a.createdAt).getTime())
}
