import BackChevron from "#/components/back-chevron"
import Loading from "#/components/loading"
import Title from "#/components/title"
import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute, Link } from "@tanstack/react-router"
import { Suspense } from "react"
import { reportesQueryOptions } from "../../../../../queries/reportes/iluminacion/reportes-query"
import {
	ChevronRight,
	Download,
	Eye,
	FileChartColumn,
	Trash2,
} from "lucide-react"
import { Button } from "#/components/ui/button"

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
		<article className="w-5/6 flex flex-col gap-2 mt-20">
			<div className="flex flex-col gap-4">
				{reportes?.map(reporte => (
					<div
						key={reporte.id}
						className="px-2 py-4 rounded-lg ring-[1px] ring-foreground/10 bg-accent flex justify-between w-full"
					>
						<div className="flex gap-2 items-center">
							<FileChartColumn className="size-8 text-blue-700/70" />
							<div className="flex flex-col gap-0">
								<span className="text-base font-semibold w-55 truncate">
									{reporte.title.toUpperCase()}
								</span>
								<p className="text-xs text-foreground/50">
									Realizado el {reporte.finishedAt?.toLocaleDateString("it-IT")}
								</p>
							</div>
						</div>
						<div className="hidden sm:flex items-center gap-4">
							<Eye className="sm:size-6 2xl:size-8 text-foreground/70 cursor-pointer hover:text-foreground transition-colors" />
							<Download className="sm:size-6 2xl:size-8 text-foreground/70 cursor-pointer hover:text-foreground transition-colors" />
							<Trash2 className="sm:size-6 2xl:size-8 text-red-700/70 cursor-pointer hover:text-foreground transition-colors" />
						</div>
						<Link to="/iluminacion/reportes/$id" params={{ id: reporte.id }}>
							<ChevronRight className="size-8 text-foreground/50" />
						</Link>
					</div>
				))}
			</div>
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
