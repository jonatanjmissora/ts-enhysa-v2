import Loading from "#/components/loading"
import { createFileRoute } from "@tanstack/react-router"
import { Suspense, useState, useEffect, lazy } from "react"
import { useSuspenseQuery } from "@tanstack/react-query"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "#/components/ui/select"
import { areasQueryOptions } from "../../../../../../queries/reportes/iluminacion/areas/areas-query"
import { sortedByName } from "#/lib/utils"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu"
import type { AreaIluminacionType } from "../../../../../../db/reportes/iluminacion/areas/schema"
import { Button } from "#/components/ui/button"
import { Ellipsis } from "lucide-react"
import EditAreaAlert from "#/components/reportes/iluminacion/edit/edit-areas"
// Duplicate imports and route definitions removed
import CreateAreaAlert from "#/components/reportes/iluminacion/edit/crear-area"
import DeleteAreaAlert from "#/components/reportes/iluminacion/nuevo-informe/areas/delete-area"

// Lazy‑load the heavy chart component
const ChartAreaInteractive = lazy(() =>
	import("#/components/reportes/iluminacion/nuevo-informe/areas/chart").then(
		mod => ({ default: mod.default })
	)
)

export const Route = createFileRoute(
	"/_protected/iluminacion/reportes/$id/areas"
)({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<Suspense
			fallback={
				<Loading
					text="obteniendo areas..."
					className="scale-50 justify-start  max-h-[50svh] "
				/>
			}
		>
			<Area />
		</Suspense>
	)
}

function Area() {
	const { id } = Route.useParams()

	const { data: areas } = useSuspenseQuery(areasQueryOptions({ reportId: id }))
	const sortedAreas = sortedByName(areas)
	// Initialize with empty selection; will be synced via effect below
	const [areaId, setAreaId] = useState<string>(sortedAreas[0]?.id || "")

	// Keep selected areaId in sync when the list changes
	useEffect(() => {
		if (sortedAreas.length === 0) {
			setAreaId("")
		} else if (!sortedAreas.find(a => a.id === areaId)) {
			setAreaId(sortedAreas[0].id)
		}
	}, [sortedAreas, areaId])

	const area = sortedAreas.find(area => area.id === areaId)
	if (!area) {
		return (
			<div className="min-h-[50svh] flex items-center justify-center flex-col gap-6">
				<span className="text-sm italic">No se encontró ningún área</span>
				<CreateAreaAlert id={id} />
			</div>
		)
	}

	const puntosWithValue = area.puntos?.filter(p => p > 0) ?? []
	const uniformidad = Math.ceil(
		puntosWithValue.reduce((acc, val) => acc + val, 0) /
			puntosWithValue.length /
			2
	)

	return (
		<article className="flex flex-col justify-center items-center py-28 w-full mx-auto relative">
			<div className="absolute top-14 left-8">
				<AreaDropdownMenu area={area} />
			</div>
			<Select value={areaId} onValueChange={setAreaId}>
				<SelectTrigger
					className="w-5/6 mx-auto rounded-lg gap-8 text-right justify-between"
					aria-label="Select a value"
				>
					<SelectValue placeholder="Seleccione Área" />
				</SelectTrigger>
				<SelectContent className="p-2 w-full">
					{sortedAreas.map(a => (
						<SelectItem key={a.id} value={a.id} className="p-4">
							{a.nombre.toUpperCase()} - {a.tipo.toUpperCase()}
						</SelectItem>
					))}
				</SelectContent>
			</Select>

			{/* Lazy‑loaded chart with fallback */}
			<Suspense
				fallback={
					<div className="mt-10 bg-accent py-10 rounded-lg w-[96dvw] sm:w-full mx-auto flex items-center justify-center h-70">
						<div className="text-center py-4">Cargando gráfico…</div>
					</div>
				}
			>
				<ChartAreaInteractive
					puntos={area.puntos}
					requerido={Number(area.valorRequerido)}
				/>
			</Suspense>

			<div className="grid grid-cols-[auto_1fr] sm:grid-cols-[1fr_1fr] gap-x-4 gap-y-2 w-5/6 sm:w-2/3 mx-auto my-10 justify-center items-center">
				<span className="text-right">Uniformidad :</span>
				<span>{uniformidad}</span>
				<span className="text-right">Valor Mínimo :</span>
				<span>{minValue(puntosWithValue)} lux</span>
				<span className="text-right">Valor Máximo :</span>
				<span>{maxValue(puntosWithValue)} lux</span>
				<span className="text-right">Puntos Medidos :</span>
				<span>{puntosWithValue.length}</span>
				<span className="text-right">Valor Requerido :</span>
				<span>{area.valorRequerido} lux</span>
				<span className="text-right">Cumplen valor requerido :</span>
				<span>
					{puntosWithValue.every(p => p >= Number(area.valorRequerido))
						? "SI"
						: "NO"}
				</span>
			</div>

			<Suspense
				fallback={<div className="text-center py-4">Cargando imágenes…</div>}
			>
				{area.imagenes[0] !== "" && (
					<div className="w-11/12 my-10">
						<div className="flex w-full grid-cols-4 gap-1 content-center">
							{area.imagenes.map(url => {
								return (
									<div className="relative w-full h-20 " key={url}>
										<img
											src={url}
											alt=""
											className="h-full w-full object-contain rounded border border-foreground/10"
										/>
									</div>
								)
							})}
						</div>
					</div>
				)}
			</Suspense>
		</article>
	)
}

function minValue(puntos: number[]) {
	return puntos.reduce((min, p) => Math.min(min, p), Infinity)
}

function maxValue(puntos: number[]) {
	return puntos.reduce((max, p) => Math.max(max, p), -Infinity)
}

function AreaDropdownMenu({ area }: { area: AreaIluminacionType }) {
	const [isMenuOpen, setIsMenuOpen] = useState(false)
	return (
		<DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" className="cursor-pointer">
					<Ellipsis className="size-7 text-foreground/50" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="p-6" align="end">
				<DropdownMenuGroup className="flex flex-col bg-accent ring-[1px] ring-foreground/20 rounded-lg p-2">
					<CreateAreaAlert
						id={area.reportId}
						dropdownMenu={true}
						setIsMenuOpen={setIsMenuOpen}
					/>
					<DropdownMenuSeparator className="bg-foreground/20 w-5/6 mx-auto" />
					<EditAreaAlert area={area} setIsMenuOpen={setIsMenuOpen} />
					<DropdownMenuSeparator className="bg-foreground/20 w-5/6 mx-auto" />
					<DeleteAreaAlert area={area} setIsMenuOpen={setIsMenuOpen} />
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
