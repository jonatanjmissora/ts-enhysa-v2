import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "#/components/ui/accordion"
import { Button } from "#/components/ui/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu"
import { Label } from "#/components/ui/label"
import { sortedByName } from "#/lib/utils"
import { useSuspenseQuery } from "@tanstack/react-query"
import { Link } from "@tanstack/react-router"
import { Edit, Ellipsis, Telescope } from "lucide-react"
import { useState } from "react"
import DeleteLocalizadaAlert from "./delete-localizada"
import { localizadasQueryOptions } from "../../../../../../queries/reportes/iluminacion/localizadas/localizadas-query"
import type { LocalizadaIluminacionType } from "../../../../../../db/reportes/iluminacion/localizadas/schema"

export default function Localizadas({ id }: { id: string }) {
	const { data: localizadas } = useSuspenseQuery(
		localizadasQueryOptions({ reportId: id })
	)

	if (!localizadas || localizadas.length === 0) return <NoLocalizada id={id} />

	const localizadaId = crypto.randomUUID().toString()

	return (
		<div className="flex flex-col gap-2 w-5/6 mt-20 ">
			<div className="w-full flex justify items-center">
				<div className="flex items-center justify-between py-1 border-b border-foreground/50 mt-10 mb-4 w-full mx-auto">
					<span className="text-lg">Localizada</span>
					<Telescope className="size-6" />
				</div>
			</div>
			<div className="w-full flex flex-col gap-10 items-center justify-center">
				<Accordion
					type="single"
					collapsible
					defaultValue=""
					className="flex flex-col gap-2 w-full mx-auto mt-5"
				>
					{sortedByName(localizadas).map(localizada => (
						<AccordionItem
							key={localizada.id}
							value={localizada.id}
							className="border-none"
						>
							<AccordionTrigger
								className={`flex px-10 border-2 border-foreground/10 items-center`}
							>
								<div className="flex items-center gap-2">
									{`${localizada.nombre.toUpperCase()} - ${localizada.tipo.toUpperCase()}`}
								</div>
							</AccordionTrigger>
							<AccordionContent className="">
								<Localizada localizada={localizada} id={id} />
							</AccordionContent>
						</AccordionItem>
					))}
				</Accordion>

				<Link
					to="/iluminacion/reportes/$id/medicion/localizadas/$localizadaId/create-localizada"
					params={{
						id,
						localizadaId,
					}}
					className="flex justify-center items-center w-full"
				>
					<Button className="w-1/2 min-w-40 sm:w-1/6 mx-auto py-5 bg-primary ring-foreground/25">
						+ Crear localizada
					</Button>
				</Link>
			</div>
		</div>
	)
}

function Localizada({
	localizada,
	id,
}: {
	id: string
	localizada: LocalizadaIluminacionType
}) {
	return (
		<div className="w-full mx-auto rounded-lg border-0 bg-accent sm:bg-background flex flex-col justify-center items-center p-0 py-10 pt-30 relative">
			<div className="absolute top-10 left-4">
				<LocalizadaDropdownMenu localizada={localizada} id={id} />
			</div>

			<div className="w-5/6 grid grid-cols-2 gap-3 border-b border-foreground/10 pb-2">
				<Label className="textL text-sm place-content-end text-amber-700">
					Nombre :{" "}
				</Label>
				<span className="textL text-sm">{localizada.nombre.toUpperCase()}</span>

				<Label className="place-content-end textL text-sm text-amber-700">
					Tipo :{" "}
				</Label>
				<span className="text-left textL text-sm">
					{localizada.tipo.toUpperCase()}
				</span>
			</div>
			<div className="w-5/6 grid grid-cols-2 gap-3 border-b border-foreground/10 py-2">
				<Label className="place-content-end textL text-sm text-amber-700">
					ilum. Tipo :
				</Label>
				<span className="text-left textL text-sm">
					{localizada.iluminacionTipo.toUpperCase()}
				</span>

				<Label className="place-content-end textL text-sm text-amber-700">
					ilum. Fuente :{" "}
				</Label>
				<span className="text-left textL text-sm">
					{localizada.iluminacionFuente.toUpperCase()}
				</span>

				<Label className="place-content-end textL text-sm text-amber-700">
					iluminación :{" "}
				</Label>
				<span className="text-left textL text-sm">
					{localizada.iluminacion.toUpperCase()}
				</span>

				<Label className="place-content-end textL text-sm text-amber-700">
					Valor Req. :{" "}
				</Label>
				<span className="text-left textL text-sm">
					{localizada.valorRequerido.toUpperCase()} lux
				</span>

				<Label className="place-content-end textL text-sm text-amber-700">
					Valor Medido :{" "}
				</Label>
				<span className="text-left textL text-sm">{localizada.valor} lux</span>

				<Label className="place-content-end textL text-sm text-amber-700">
					Observaciones :{" "}
				</Label>
				<span className="text-left textL text-sm">
					{localizada.observaciones.toUpperCase()}
				</span>

				<Label className="place-content-end textL text-sm text-amber-700">
					Fecha :{" "}
				</Label>
				<span className="text-left textL text-sm">
					{localizada.timestamps[0].toLocaleDateString("it-IT", {
						day: "2-digit",
						month: "2-digit",
						year: "numeric",
					})}
				</span>
			</div>

			{localizada.imagenes[0] !== "" && (
				<div className="w-full my-10">
					<div className="flex w-full grid-cols-4 gap-2 content-center">
						{localizada.imagenes.map(url => {
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

export function LocalizadaDropdownMenu({
	localizada,
	id,
}: {
	localizada: LocalizadaIluminacionType
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
						to={
							"/iluminacion/reportes/$id/medicion/localizadas/$localizadaId/edit-localizada"
						}
						params={{
							id,
							localizadaId: localizada.id,
						}}
						className="flex justify-center items-center gap-4 p-4 hover:bg-background rounded-lg"
					>
						<Edit className="size-3" />
						Editar
					</Link>
					<DropdownMenuSeparator />
					<DeleteLocalizadaAlert
						localizada={localizada}
						setIsMenuOpen={setIsMenuOpen}
					/>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

function NoLocalizada({ id }: { id: string }) {
	const localizadaId = crypto.randomUUID().toString()
	return (
		<div className="w-5/6 h-[30svh] flex flex-col gap-8 items-center justify-center mx-auto mt-20">
			<div className="flex items-center justify-between py-1 border-b border-foreground/50 mt-10 mb-4 w-full mx-auto">
				<span className="text-lg">Mediciones Localizadas</span>
				<Telescope className="size-6" />
			</div>
			<span className="text-sm font-medium text-gray-500 italic text-center text-pretty">
				Parece que no tienes mediciones localizadas
			</span>
			{/* <CreateAreaAlert /> */}
			<Link
				to="/iluminacion/reportes/$id/medicion/localizadas/$localizadaId/create-localizada"
				params={{
					id,
					localizadaId,
				}}
				className="flex justify-center items-center w-full"
			>
				<Button className="w-1/2 min-w-40 sm:w-1/6 mx-auto py-5 bg-primary ring-foreground/25">
					+ Crear localizada
				</Button>
			</Link>
		</div>
	)
}
