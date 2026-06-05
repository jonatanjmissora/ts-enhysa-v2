import BackChevron from "#/components/back-chevron"
import Loading from "#/components/loading"
import Title from "#/components/title"
import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute, Link } from "@tanstack/react-router"
import { Suspense } from "react"
import { Button } from "#/components/ui/button"
import { Label } from "#/components/ui/label"
import { ChevronRight, Edit, RulerDimensionLine } from "lucide-react"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Ellipsis } from "lucide-react"
import { useState } from "react"
import DeleteAreaAlert from "#/components/reportes/iluminacion/nuevo-informe/areas/delete-area"
import { sortedByName } from "#/lib/utils"
import useScrollTop from "#//hooks/scroll-top"
import { areasQueryOptions } from "../../../../../../../../queries/reportes/iluminacion/areas/areas-query"
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "#/components/ui/accordion"
import type { AreaIluminacionType } from "../../../../../../../../db/reportes/iluminacion/areas/schema"

export const Route = createFileRoute(
	"/_protected/iluminacion/reportes/$id/_CRUD/areas/"
)({
	component: RouteComponent,
})

function RouteComponent() {
	useScrollTop()
	return (
		<article className="w-full min-h-svh flex flex-col items-center gap-0 relative mb-60">
			<BackChevron to="/iluminacion/reportes" />
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
	const { id } = Route.useParams()

	const { data: areas } = useSuspenseQuery(areasQueryOptions({ reportId: id }))

	if (!areas || areas.length === 0) return <NoAreas />

	const areaId = crypto.randomUUID().toString()

	return (
		<div className="w-full flex flex-col gap-10 items-center justify-center">
			<Accordion
				type="single"
				collapsible
				defaultValue=""
				className="flex flex-col gap-2 w-5/6 mx-auto mt-5"
			>
				{sortedByName(areas).map(area => (
					<AccordionItem key={area.id} value={area.id} className="border-none">
						<AccordionTrigger
							className={`flex px-10 border-2 ${area.puntos.length === 0 ? "border-red-500/20" : checkAllPuntos(area) ? "border-foreground/10" : "border-amber-500/20"} items-center`}
						>
							<div className="flex items-center gap-2">
								{`${area.nombre.toUpperCase()} - ${area.tipo.toUpperCase()}`}
							</div>
						</AccordionTrigger>
						<AccordionContent className="">
							<Area area={area} />
						</AccordionContent>
					</AccordionItem>
				))}
			</Accordion>

			{/* <CreateAreaAlert /> */}
			<Link
				to="/iluminacion/reportes/$id/areas/$areaId/create-area"
				params={{
					id,
					areaId,
				}}
				className="flex justify-center items-center w-full"
			>
				<Button className="w-1/2 min-w-40 sm:w-1/6 mx-auto py-5 bg-primary ring-foreground/25">
					+ Crear area
				</Button>
			</Link>

			<div className="flex flex-col justify-center items-center gap-4 w-5/6 sm:w-1/2 mt-30">
				<Link
					to="/iluminacion/reportes/$id/crud/create-resumen"
					params={{ id }}
					className="flex-1 w-full"
				>
					<Button type="submit" className="w-full py-6">
						Siguiente <ChevronRight className="size-6" />
					</Button>
				</Link>
			</div>
		</div>
	)
}

function Area({ area }: { area: AreaIluminacionType }) {
	const { id } = Route.useParams()
	const celdasMedidas = area.puntos.filter(punto => punto > 0)
	const uniformidad = Math.ceil(
		celdasMedidas.reduce((acc, valor) => acc + valor, 0) /
			celdasMedidas.length /
			2
	)

	return (
		<div className="w-full mx-auto rounded-lg border-0 bg-accent sm:bg-background flex flex-col justify-center items-center p-0 py-10 pt-30 relative">
			<div className="absolute top-10 left-4">
				<AreaDropdownMenu area={area} id={id} />
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
			<div className="w-5/6 grid grid-cols-2 gap-4 border-b border-foreground/10 py-2">
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
			{area.puntos.some(punto => punto > 0) ? (
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
			) : (
				<div className="w-5/6 flex items-center justify-center gap-4 border-b border-foreground/10 py-2 text-amber-700">
					<span className="text-center">Sin puntos medidos</span>
					<Link
						to="/iluminacion/reportes/$id/areas/$areaId/puntos"
						params={{
							id,
							areaId: area.id,
						}}
						className="flex justify-center items-center"
					>
						<Button className="w-1/2 min-w-40 sm:w-1/6 mx-auto py-5 bg-primary ring-foreground/25">
							+ Medir Puntos
						</Button>
					</Link>
				</div>
			)}

			<div className="w-full flex justify-center items-center gap-2 mt-4">
				<span className="text-left textL text-sm italic">
					Uniformidad de iluminancia:
				</span>
				<span className="text-left textL text-sm font-bold">
					{area.puntos.some(punto => punto > 0) ? uniformidad : "-"}
				</span>
			</div>
			{area.imagenes[0] !== "" && (
				<div className="w-full my-10">
					<div className="flex w-full grid-cols-4 gap-2 content-center">
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
		</div>
	)
}

function NoAreas() {
	const { id } = Route.useParams()
	const areaId = crypto.randomUUID().toString()
	return (
		<div className="w-5/6 h-[30svh] flex flex-col gap-8 items-center justify-center mx-auto my-12">
			<span className="text-sm font-medium text-gray-500 italic text-center text-pretty">
				Parece que no tienes áreas registradas
			</span>
			{/* <CreateAreaAlert /> */}
			<Link
				to="/iluminacion/reportes/$id/areas/$areaId/create-area"
				params={{
					id,
					areaId,
				}}
				className="flex justify-center items-center w-full"
			>
				<Button className="w-1/2 min-w-40 sm:w-1/6 mx-auto py-5 bg-primary ring-foreground/25">
					+ Crear area
				</Button>
			</Link>
		</div>
	)
}

export default function AreaDropdownMenu({
	area,
	id,
}: {
	area: AreaIluminacionType
	id: string
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
					{/* <EditAreaAlert area={area} setIsMenuOpen={setIsMenuOpen} /> */}
					<Link
						to={"/iluminacion/reportes/$id/areas/$areaId/edit-area"}
						params={{
							id,
							areaId: area.id,
						}}
						className="flex justify-center items-center gap-4 p-4 hover:bg-background rounded-lg"
					>
						<Edit className="size-3" />
						Editar
					</Link>
					<DropdownMenuSeparator />
					<DeleteAreaAlert area={area} setIsMenuOpen={setIsMenuOpen} />
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

function checkAllPuntos(area: AreaIluminacionType) {
	return area.puntos.every(punto => punto > 0)
}
