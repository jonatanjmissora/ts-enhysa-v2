import BackChevron from "#/components/back-chevron"
import Loading from "#/components/loading"
import Title from "#/components/title"
import { createFileRoute } from "@tanstack/react-router"
import { Suspense, useState } from "react"
import { reporteNuevoQueryOptions } from "../../../../../../queries/reportes/iluminacion/reportes-query"
import { useSuspenseQuery } from "@tanstack/react-query"
import { areasQueryOptions } from "../../../../../../queries/reportes/iluminacion/areas/areas-query"
import { Label } from "#/components/ui/label"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "#/components/ui/select"
import { Link } from "@tanstack/react-router"

export const Route = createFileRoute(
	"/_protected/iluminacion/nuevo-informe/resumen/"
)({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<article className="w-full min-h-svh flex flex-col items-center gap-0 relative mb-60">
			<BackChevron to="/iluminacion/nuevo-informe/areas" />
			<Title text="Nuevo Informe" className="mt-15" />
			<IluminacionResumen />
		</article>
	)
}

function IluminacionResumen() {
	return (
		<Suspense
			fallback={
				<Loading
					text="obteniendo opiniones..."
					className="scale-50 justify-start  max-h-[50svh] "
				/>
			}
		>
			<ReporteNuevo />
		</Suspense>
	)
}

function ReporteNuevo() {
	const { data: reporteNuevo } = useSuspenseQuery(reporteNuevoQueryOptions)

	if (!reporteNuevo) return <NoData />

	return (
		<Suspense
			fallback={
				<Loading
					text="obteniendo nuevo reporte..."
					className="scale-50 justify-start  max-h-[50svh] "
				/>
			}
		>
			<Areas reportId={reporteNuevo.id} />
		</Suspense>
	)
}

function Areas({ reportId }: { reportId: string }) {
	const { data: areas } = useSuspenseQuery(areasQueryOptions({ reportId }))
	const [areaId, setAreaId] = useState<string>(areas[0].id)

	if (!areas || areas.length === 0) return <NoData />

	const area = areas.find(area => area.id === areaId)
	if (!area) return <NoData />

	const puntosWithValue = area?.puntos?.filter(punto => punto > 0)
	const uniformidad = Math.ceil(
		puntosWithValue?.reduce((acc, valor) => acc + valor, 0) /
			puntosWithValue?.length /
			2
	)

	return (
		<article className="flex flex-col justify-center items-center my-30 w-5/6 mx-auto">
			<Label className="textL text-xl mr-auto">Area</Label>
			<Select value={areaId} onValueChange={setAreaId}>
				<SelectTrigger
					className="w-full rounded-lg gap-8"
					aria-label="Select a value"
				>
					<SelectValue placeholder="Seleccione Area" />
				</SelectTrigger>
				<SelectContent className="p-2 w-full">
					{areas.map(area => (
						<SelectItem key={area.id} value={area.id} className="p-4">
							{area.nombre.toUpperCase()} - {area.tipo.toUpperCase()}
						</SelectItem>
					))}
				</SelectContent>
			</Select>

			{/* <ChartAreaInteractive area={areaData} /> */}

			<div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 w-5/6 mx-aut my-10">
				<span>Uniformidad : </span>
				<span>{uniformidad}</span>

				<span>Valor Mínimo : </span>
				<span>{minValue(puntosWithValue)} lux</span>

				<span>Valor Máximo : </span>
				<span>{maxValue(puntosWithValue)} lux</span>

				<span>Puntos Medidos : </span>
				<span>{puntosWithValue.length}</span>

				<span>Valor Requerido : </span>
				<span>{area.valorRequerido} lux</span>

				<span>Cumplen valor requerido : </span>
				<span>
					{puntosWithValue.every(punto => punto >= Number(area.valorRequerido))
						? "SI"
						: "NO"}
				</span>
			</div>

			<div className="flex flex-row justify-center gap-5 sm:gap-10 items-center w-full mx-auto mt-10 p-0">
				<Link
					to="/iluminacion"
					className="themeBtnBackground py-2 rounded-lg textL text-sm sm:text-base w-1/2 flex items-center justify-center"
				>
					<span>Generar PDF</span>
				</Link>
			</div>
		</article>
	)
}

function NoData() {
	return <span className="text-sm italic">No hay datos para mostrar.</span>
}

function minValue(puntos: number[]) {
	return puntos.reduce((min, punto) => Math.min(min, punto), Infinity)
}

function maxValue(puntos: number[]) {
	return puntos.reduce((max, punto) => Math.max(max, punto), -Infinity)
}
