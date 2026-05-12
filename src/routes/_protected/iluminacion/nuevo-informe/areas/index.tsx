import BackChevron from "#/components/back-chevron"
import Loading from "#/components/loading"
import Title from "#/components/title"
import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute, Link } from "@tanstack/react-router"
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
import { ChevronRight, RulerDimensionLine } from "lucide-react"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Ellipsis } from "lucide-react"
import { useState } from "react"
import DeleteAreaAlert from "#/components/reportes/iluminacion/areas/delete-area"
import EditAreaAlert from "#/components/reportes/iluminacion/areas/edit-area"

export const Route = createFileRoute(
	"/_protected/iluminacion/nuevo-informe/areas/"
)({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<article className="w-full min-h-svh flex flex-col items-center gap-0 relative mb-60">
			<BackChevron to="/iluminacion/nuevo-informe" />
			<Title text="Nuevo Informe" className="mt-15" />
			<div className="flex items-center justify-between px-6 py-1 border-b border-foreground/50 mt-10 mb-4 w-5/6 mx-auto">
				<RulerDimensionLine className="size-6" />
				<span className="text-lg">Areas</span>
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
		<div className="w-full flex flex-col gap-10 items-center justify-center">
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

			<CreateAreaAlert />

			<div className="flex flex-col justify-center items-center gap-4 w-5/6 mt-30">
				<Link to="/iluminacion/nuevo-informe/opinon" className="flex-1 w-full">
					<Button type="submit" className="w-full py-6">
						Siguiente <ChevronRight className="size-6" />
					</Button>
				</Link>
			</div>
		</div>
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
		<div className="w-full mx-auto rounded-lg border-0 bg-accent sm:bg-background flex flex-col justify-center items-center p-0 py-10 pt-30 relative">
			<div className="absolute top-10 right-4">
				<AreaDropdownMenu area={area} />
			</div>

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

export default function AreaDropdownMenu({
	area,
}: {
	area: AreaIluminacionType
}) {
	const [isMenuOpen, setIsMenuOpen] = useState(false)
	return (
		<DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" className="cursor-pointer">
					<Ellipsis className="size-7" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="p-6" align="end">
				<DropdownMenuGroup className="flex flex-col bg-accent ring-[1px] ring-foreground/20 rounded-lg p-2">
					<EditAreaAlert area={area} setIsMenuOpen={setIsMenuOpen} />
					<DropdownMenuSeparator />
					<DeleteAreaAlert area={area} setIsMenuOpen={setIsMenuOpen} />
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
