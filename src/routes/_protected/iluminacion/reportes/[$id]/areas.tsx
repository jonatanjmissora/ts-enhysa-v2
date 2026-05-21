import Loading from "#/components/loading"
import { createFileRoute } from "@tanstack/react-router"
import { Suspense, useState } from "react"
import { useSuspenseQuery } from "@tanstack/react-query"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "#/components/ui/select"
import { reporteQueryOptions } from "../../../../../../queries/reportes/iluminacion/reportes-query"
import { areasQueryOptions } from "../../../../../../queries/reportes/iluminacion/areas/areas-query"
import { ChartAreaInteractive } from "#/components/reportes/iluminacion/areas/chart"
import { sortedByName } from "#/lib/utils"

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
			<Reporte />
		</Suspense>
	)
}

function Reporte() {
	const { id } = Route.useParams()

	const { data: reporte } = useSuspenseQuery(reporteQueryOptions({ id }))
	const { data: areas } = useSuspenseQuery(areasQueryOptions({ reportId: id }))
	const sortedAreas = sortedByName(areas)
	const [areaId, setAreaId] = useState<string>(sortedAreas[0].id)

	const area = sortedAreas.find(area => area.id === areaId)
	if (!area || !reporte)
		return (
			<span className="text-sm italic mt-20">No se encontro ninguna area</span>
		)

	const puntosWithValue = area?.puntos?.filter(punto => punto > 0)
	const uniformidad = Math.ceil(
		puntosWithValue?.reduce((acc, valor) => acc + valor, 0) /
			puntosWithValue?.length /
			2
	)

	return (
		<article className="flex flex-col justify-center items-center my-20 w-full mx-auto">
			<Select value={areaId} onValueChange={setAreaId}>
				<SelectTrigger
					className="w-5/6 mx-auto rounded-lg gap-8 text-right justify-between"
					aria-label="Select a value"
				>
					<SelectValue placeholder="Seleccione Area" />
				</SelectTrigger>
				<SelectContent className="p-2 w-full">
					{sortedAreas.map(area => (
						<SelectItem key={area.id} value={area.id} className="p-4">
							{area.nombre.toUpperCase()} - {area.tipo.toUpperCase()}
						</SelectItem>
					))}
				</SelectContent>
			</Select>

			<ChartAreaInteractive
				puntos={area.puntos}
				requerido={Number(area.valorRequerido)}
			/>

			<div className="grid grid-cols-[auto_1fr] sm:grid-cols-[1fr_1fr] gap-x-4 gap-y-2 w-5/6 sm:w-2/3 mx-auto my-10 justify-center items-center">
				<span className="text-right">Uniformidad : </span>
				<span>{uniformidad}</span>

				<span className="text-right">Valor Mínimo : </span>
				<span>{minValue(puntosWithValue)} lux</span>

				<span className="text-right">Valor Máximo : </span>
				<span>{maxValue(puntosWithValue)} lux</span>

				<span className="text-right">Puntos Medidos : </span>
				<span>{puntosWithValue.length}</span>

				<span className="text-right">Valor Requerido : </span>
				<span>{area.valorRequerido} lux</span>

				<span className="text-right">Cumplen valor requerido : </span>
				<span>
					{puntosWithValue.every(punto => punto >= Number(area.valorRequerido))
						? "SI"
						: "NO"}
				</span>
			</div>

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
		</article>
	)
}

function minValue(puntos: number[]) {
	return puntos.reduce((min, punto) => Math.min(min, punto), Infinity)
}

function maxValue(puntos: number[]) {
	return puntos.reduce((max, punto) => Math.max(max, punto), -Infinity)
}
