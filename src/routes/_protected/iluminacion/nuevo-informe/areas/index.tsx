import BackChevron from "#/components/back-chevron"
import Loading from "#/components/loading"
import Title from "#/components/title"
import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { Suspense } from "react"
import { areasQueryOptions } from "../../../../../../queries/reportes/iluminacion/areas/areas-query"
import { Button } from "#/components/ui/button"
import CreateAreaAlert from "#/components/reportes/iluminacion/areas/crear-area"
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "#/components/ui/accordion"
import type { AreaIluminacionType } from "../../../../../../db/reportes/iluminacion/areas/schema"
import { Label } from "#/components/ui/label"

export const Route = createFileRoute(
	"/_protected/iluminacion/nuevo-informe/areas/"
)({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<article className="w-full min-h-svh flex flex-col items-center gap-0 relative mb-60">
			<BackChevron to="/iluminacion" />
			<Title text="Nuevo Informe" className="mt-15" />
			<div className="flex items-center justify-end w-full">
				<Title text="Areas" className="text-end px-6" />
			</div>
			<IluminacionAreas />
		</article>
	)
}

function IluminacionAreas() {
	return (
		<Suspense
			fallback={
				<Loading
					text="obteniendo áreas..."
					className="scale-50 justify-start  max-h-[50svh] "
				/>
			}
		>
			<Areas />
		</Suspense>
	)
}

function Areas() {
	const { data: areas } = useSuspenseQuery(areasQueryOptions)

	if (!areas || areas.length === 0) return <NoAreas />

	return (
		<>
			<Accordion
				type="single"
				collapsible
				defaultValue=""
				className="flex flex-col gap-2 w-5/6 mx-auto mt-5"
			>
				{areas.map(area => (
					<AccordionItem
						key={area.id}
						value={area.id}
						className="border-b border-foreground/5 last:border-b-0"
					>
						<AccordionTrigger className="flex px-10 border-b border-foreground/10 items-center bw">
							<div className="flex items-center gap-2 textXS">
								{`${area.nombre.toUpperCase()} - ${area.tipo.toUpperCase()}`}
							</div>
						</AccordionTrigger>
						<AccordionContent className="">
							<Area area={area} />
						</AccordionContent>
					</AccordionItem>
				))}
			</Accordion>
			<Button>Agregar Area</Button>
		</>
	)
}

function Area({ area }: { area: AreaIluminacionType }) {
	const celdasMedidas = area.puntos.filter(punto => punto > 0)
	const uniformidad = Math.ceil(
		celdasMedidas.reduce((acc, valor) => acc + valor, 0) /
			celdasMedidas.length /
			2
	)

	return (
		<div className="w-full mx-auto rounded-lg border-0 bg-accent sm:bg-background flex flex-col justify-center items-center p-0 py-10">
			<div className="w-5/6 grid grid-cols-2 gap-3 border-b border-foreground/10 pb-2">
				<Label className="textL text-sm place-content-end">Nombre : </Label>
				<span className="textL text-sm">{area.nombre.toUpperCase()}</span>

				<Label className="place-content-end textL text-sm">Tipo : </Label>
				<span className="text-left textL text-sm">
					{area.tipo.toUpperCase()}
				</span>
			</div>
			<div className="w-5/6 grid grid-cols-2 gap-3 border-b border-foreground/10 py-2">
				<Label className="place-content-end textL text-sm">ilum. Tipo :</Label>
				<span className="text-left textL text-sm">
					{area.iluminacionTipo.toUpperCase()}
				</span>

				<Label className="place-content-end textL text-sm">
					ilum. Fuente :{" "}
				</Label>
				<span className="text-left textL text-sm">
					{area.iluminacionFuente.toUpperCase()}
				</span>

				<Label className="place-content-end textL text-sm">
					iluminación :{" "}
				</Label>
				<span className="text-left textL text-sm">
					{area.iluminacion.toUpperCase()}
				</span>

				<Label className="place-content-end textL text-sm">Valor Req. : </Label>
				<span className="text-left textL text-sm">
					{area.valorRequerido.toUpperCase()} lm
				</span>

				<Label className="place-content-end textL text-sm">
					Observaciones :{" "}
				</Label>
				<span className="text-left textL text-sm">
					{area.observaciones.toUpperCase()}
				</span>
			</div>
			<div className="w-5/6 grid grid-cols-2 gap-3 border-b border-foreground/10 py-2">
				<Label className="place-content-end textL text-sm">Largo : </Label>
				<span className="text-left textL text-sm">
					{area.largo.toFixed(0)} mts.
				</span>

				<Label className="place-content-end textL text-sm">Ancho : </Label>
				<span className="text-left textL text-sm">
					{area.ancho.toFixed(0)} mts.
				</span>

				<Label className="place-content-end textL text-sm">Alto : </Label>
				<span className="text-left textL text-sm">
					{area.alto.toFixed(0)} mts.
				</span>

				<Label className="place-content-end textL text-sm">
					Celdas medidas :{" "}
				</Label>
				<span className="text-left textL text-sm">
					{celdasMedidas.length}/{area.puntos.length}
				</span>
			</div>
			<div className="w-5/6 grid grid-cols-2 gap-3 border-b border-foreground/10 py-2">
				{area.puntos.map((punto, index) => (
					<div
						key={index}
						className={`flex gap-2 justify-center items-center ${punto > 0 ? "bg-background" : "bg-accent"} p-1 rounded-sm`}
					>
						<Label className="textL text-sm text-foreground/50">
							Punto {index + 1} :{" "}
						</Label>
						<span className="textL text-sm">{punto.toFixed(0)} lm</span>
					</div>
				))}
			</div>

			<div className="w-full flex justify-center items-center gap-2 mt-4">
				<span className="text-left textL text-sm italic">
					Uniformidad de iluminancia:
				</span>
				<span className="text-left textL text-sm font-bold">{uniformidad}</span>
			</div>

			<div className="w-5/6 flex gap-4 justify-betwen items-center h-20 mt-10">
				MENU
			</div>
		</div>
	)
}

function NoAreas() {
	return (
		<div className="w-5/6 h-[30svh] flex flex-col gap-8 items-center justify-center mx-auto my-12">
			<span className="text-sm font-medium text-gray-500 italic text-center text-pretty">
				Parece que no tienes áreas registradas
			</span>
			<CreateAreaAlert />
		</div>
	)
}
