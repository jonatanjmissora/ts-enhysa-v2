import BackChevron from "#/components/back-chevron"
import Loading from "#/components/loading"
import Title from "#/components/title"
import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute, Link } from "@tanstack/react-router"
import { Suspense, useState } from "react"
import { reportesQueryOptions } from "../../../../../queries/reportes/iluminacion/reportes-query"
import {
	FileClock,
	ChevronRight,
	FileChartColumn,
	Filter,
	FilterX,
	FileLock,
} from "lucide-react"
import { Button } from "#/components/ui/button"
import type { ReporteIluminacionType } from "../../../../../db/reportes/iluminacion/schema"
import { Input } from "#/components/ui/input"
import { Label } from "#/components/ui/label"
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "#/components/ui/select"
import { empresasQueryOptions } from "../../../../../queries/empresas/empresas-query"
import { cn } from "#/lib/utils"
import useScrollTop from "#/hooks/scroll-top"

export const Route = createFileRoute("/_protected/iluminacion/reportes/")({
	component: RouteComponent,
})

function RouteComponent() {
	useScrollTop()
	return (
		<article className="w-full min-h-svh flex flex-col items-center gap-0 relative mb-60">
			<BackChevron to="/iluminacion" />
			<Title text="Informes Iluminación" className="mt-15" />
			<Link
				to="/iluminacion/reportes/instructivo"
				search={{
					from: "/iluminacion/reportes",
				}}
				className="w-11/12 italic text-foreground/60 tracking-wider text-sm underline text-right"
			>
				Instructivo: Mi primer Informe !
			</Link>
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
	const id = crypto.randomUUID().toString()
	const { data: reportes } = useSuspenseQuery(reportesQueryOptions)
	const { data: empresas } = useSuspenseQuery(empresasQueryOptions)

	const [showFilters, setShowFilters] = useState(false)
	const [desde, setDesde] = useState<string>("")
	const [hasta, setHasta] = useState<string>("")
	const [empresaId, setEmpresaId] = useState<string>("all")

	if (!reportes || reportes.length === 0) return <NoReports />

	const filteredReportes = reportes.filter(reporte => {
		const rDate = reporte.finishedAt
			? new Date(reporte.finishedAt)
			: new Date(reporte.createdAt)

		if (desde) {
			const [y, m, d] = desde.split("-").map(Number)
			const desdeDate = new Date(y, m - 1, d, 0, 0, 0, 0)
			if (rDate < desdeDate) return false
		}

		if (hasta) {
			const [y, m, d] = hasta.split("-").map(Number)
			const hastaDate = new Date(y, m - 1, d, 23, 59, 59, 999)
			if (rDate > hastaDate) return false
		}

		if (empresaId && empresaId !== "all") {
			if (reporte.empresaId !== empresaId) return false
		}

		return true
	})

	const activeFiltersCount =
		(desde ? 1 : 0) + (hasta ? 1 : 0) + (empresaId !== "all" ? 1 : 0)

	return (
		<article className="w-5/6 sm:w-2/3 flex flex-col gap-8 mt-20">
			{/* Barra de filtros */}
			<div className="flex justify-between items-center w-full pb-2 border-b border-foreground/10">
				<span className="text-sm text-foreground/60 font-medium">
					{filteredReportes.length === reportes.length
						? `${reportes.length} reportes`
						: `${filteredReportes.length} de ${reportes.length} filtrados`}
				</span>
				<div className="flex gap-2 items-center">
					{activeFiltersCount > 0 && (
						<Button
							variant="ghost"
							size="sm"
							onClick={() => {
								setDesde("")
								setHasta("")
								setEmpresaId("all")
							}}
							className="h-8 text-xs text-foreground/60 hover:text-foreground flex gap-1 items-center px-2"
						>
							<FilterX className="size-4" />
							Limpiar
						</Button>
					)}
					<Button
						variant={
							showFilters || activeFiltersCount > 0 ? "default" : "outline"
						}
						size="sm"
						onClick={() => setShowFilters(!showFilters)}
						className={cn(
							"h-8 text-xs flex gap-2 items-center relative",
							(showFilters || activeFiltersCount > 0) &&
								"bg-primary text-primary-foreground ring-1 ring-primary"
						)}
					>
						<Filter className="size-4" />
						<span>Filtrar</span>
						{activeFiltersCount > 0 && (
							<span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-amber-950 font-bold rounded-full size-4 flex items-center justify-center text-[10px]">
								{activeFiltersCount}
							</span>
						)}
					</Button>
				</div>
			</div>

			{/* Acordeón de filtros */}
			<div
				className={cn(
					"grid transition-all duration-300 ease-in-out w-full",
					showFilters
						? "grid-rows-[1fr] opacity-100 mb-2"
						: "grid-rows-[0fr] opacity-0 pointer-events-none"
				)}
			>
				<div className="overflow-hidden">
					<div className="p-5 flex flex-col sm:flex-row gap-4 bg-accent/35 border border-foreground/10 rounded-lg shadow-inner w-full">
						{/* Filtro Empresa */}
						<div className="flex flex-col gap-1.5 grow min-w-[200px]">
							<Label
								htmlFor="empresa-filter"
								className="text-xs font-semibold text-foreground/70"
							>
								Empresa
							</Label>
							<Select value={empresaId} onValueChange={setEmpresaId}>
								<SelectTrigger
									id="empresa-filter"
									className="w-full justify-start text-left bg-background/50"
								>
									<SelectValue placeholder="Todas las empresas" />
								</SelectTrigger>
								<SelectContent
									position="popper"
									className="max-h-60 overflow-y-auto"
								>
									<SelectGroup>
										<SelectItem value="all">TODAS LAS EMPRESAS</SelectItem>
										{empresas?.map(empresa => (
											<SelectItem key={empresa.id} value={empresa.id}>
												{empresa.razonSocial.toUpperCase()}
											</SelectItem>
										))}
									</SelectGroup>
								</SelectContent>
							</Select>
						</div>

						{/* Filtro Fecha Desde */}
						<div className="flex flex-col gap-1.5 grow sm:max-w-[200px] min-w-[150px]">
							<Label
								htmlFor="desde-filter"
								className="text-xs font-semibold text-foreground/70"
							>
								Fecha Desde
							</Label>
							<Input
								id="desde-filter"
								type="date"
								value={desde}
								onChange={e => setDesde(e.target.value)}
								className="text-left block w-full bg-background/50"
							/>
						</div>

						{/* Filtro Fecha Hasta */}
						<div className="flex flex-col gap-1.5 grow sm:max-w-[200px] min-w-[150px]">
							<Label
								htmlFor="hasta-filter"
								className="text-xs font-semibold text-foreground/70"
							>
								Fecha Hasta
							</Label>
							<Input
								id="hasta-filter"
								type="date"
								value={hasta}
								onChange={e => setHasta(e.target.value)}
								className="text-left block w-full bg-background/50"
							/>
						</div>
					</div>
				</div>
			</div>

			<ReportesList filteredReportes={filteredReportes} />

			<Link
				to="/iluminacion/reportes/$id/crud/create-general"
				params={{
					id,
				}}
				className="my-20 py-3 w-5/6 sm:w-1/2 mx-auto tracking-widest font-semibold text-base bg-primary rounded-lg flex gap-2 items-center justify-center ring-[1px] ring-foreground/25"
			>
				<FileChartColumn size={20} />
				Nuevo Informe
			</Link>
		</article>
	)
}

function ReportesList({
	filteredReportes,
}: {
	filteredReportes: ReporteIluminacionType[]
}) {
	return (
		<div className="flex flex-col gap-4">
			{filteredReportes.length === 0 ? (
				<div className="text-center py-10 text-sm text-foreground/50 italic bg-accent/20 rounded-lg border border-dashed border-foreground/10">
					No se encontraron reportes que coincidan con los filtros.
				</div>
			) : (
				sortedByRecentDate(filteredReportes)?.map(reporte => (
					<div
						key={reporte.id}
						className="px-2 py-4 rounded-lg ring-[1px] dark:ring-foreground/10 ring-foreground/50 bg-accent flex justify-between w-full"
					>
						<div className="flex gap-2 items-center">
							{!reporte.finishedAt ? (
								<FileClock className="size-8 text-amber-600" />
							) : !reporte.creditConsumed ? (
								<FileLock className="size-8 text-yellow-600" />
							) : (
								<FileChartColumn className="size-8 text-blue-600" />
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
									: "/iluminacion/reportes/$id/crud/edit-general"
							}
							params={{ id: reporte.id }}
						>
							<ChevronRight className="size-8 text-foreground/50" />
						</Link>
					</div>
				))
			)}
		</div>
	)
}

function NoReports() {
	const id = crypto.randomUUID().toString()
	return (
		<article className="w-5/6 mx-auto flex flex-col items-center justify-center gap-10 mt-20">
			<span className="text-center text-foreground/70 text-sm italic tracking-wide">
				No posee informes de Iluminación. Realice su primer reporte ...
			</span>
			<Link
				to="/iluminacion/reportes/$id/crud/create-general"
				params={{
					id,
				}}
			>
				<Button>Nuevo Reporte</Button>
			</Link>
		</article>
	)
}

function sortedByRecentDate(reportes: ReporteIluminacionType[]) {
	return reportes?.sort(
		(a, b) =>
			(b.finishedAt || b.createdAt).getTime() -
			(a.finishedAt || a.createdAt).getTime()
	)
}
