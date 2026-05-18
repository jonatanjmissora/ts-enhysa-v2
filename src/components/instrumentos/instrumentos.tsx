import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "../ui/accordion"
import type { InstrumentoType } from "../../../db/instrumentos/schema"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { useSuspenseQuery } from "@tanstack/react-query"
import { instrumentosQueryOptions } from "../../../queries/instrumentos/instrumentos-query"
import { CreateInstrumento } from "./create-instrumento"
import { useState } from "react"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { Button } from "../ui/button"
import { Ellipsis } from "lucide-react"
import DeleteInstrumento from "./delete-instrumento"
import { EditInstrumento } from "./edit-instrumento"
import useScrollTop from "#/hooks/scroll-top"

export default function Instrumentos() {
	const { data: instrumentos } = useSuspenseQuery(instrumentosQueryOptions)
	// const instrumentos = null
	if (!instrumentos || instrumentos.length === 0) return <InstrumentosVacios />
	return <HayInstrumentos instrumentos={instrumentos} />
}

function HayInstrumentos({
	instrumentos,
}: {
	instrumentos: InstrumentoType[]
}) {
	useScrollTop()
	return (
		<div className="w-full flex flex-col gap-2">
			<Accordion
				type="single"
				collapsible
				defaultValue=""
				className="flex flex-col gap-2 w-11/12 mx-auto py-20"
			>
				{instrumentos.map(instrumento => (
					<AccordionItem
						key={instrumento.id}
						value={instrumento.id}
						className="border-b border-foreground/10 last:border-b-0 py-2"
					>
						<AccordionTrigger className="flex px-5 w-11/12 sm:w-full flex-wrap items-center bg-accent ring-[1px] dark:ring-foreground/10 ring-foreground/50">
							<div className="flex items-center gap-2 text-sm tracking-wider w-60 sm:w-max truncate">
								{instrumento.nombre.toUpperCase()} -{" "}
								{instrumento.marca.toUpperCase()}
							</div>
						</AccordionTrigger>
						<AccordionContent>
							<Instrumento instrumento={instrumento} />
						</AccordionContent>
					</AccordionItem>
				))}
			</Accordion>
			<div className="w-5/6 mx-auto flex justify-end mb-80">
				<CreateInstrumento />
			</div>
		</div>
	)
}

function Instrumento({ instrumento }: { instrumento: InstrumentoType }) {
	return (
		<div className="bg-accent py-20 flex items-center justify-center flex-col relative">
			<div className="sm:hidden block absolute top-10 left-6">
				<InstrumentoDropdownMenu instrumento={instrumento} />
			</div>
			<div className="grid-cols-1 grid sm:grid-cols-2 gap-8 w-5/6 my-10">
				<div className="flex flex-col gap-1">
					<Label className="tracking-wider" htmlFor="marca">
						Marca
					</Label>
					<Input
						id="marca"
						placeholder="Marca"
						value={instrumento.marca.toUpperCase()}
						readOnly
					/>
				</div>
				<div className="flex flex-col gap-1">
					<Label className="tracking-wider" htmlFor="cargo">
						Modelo
					</Label>
					<Input
						id="modelo"
						placeholder="Modelo"
						value={instrumento.modelo.toUpperCase()}
						readOnly
					/>
				</div>
				<div className="flex flex-col gap-1">
					<Label className="tracking-wider" htmlFor="serie">
						Nro Serie
					</Label>
					<Input
						id="serie"
						placeholder="Serie"
						value={instrumento.serie}
						readOnly
					/>
				</div>
				<div className="flex flex-col gap-1">
					<Label className="tracking-wider" htmlFor="calibracion">
						Calibración
					</Label>
					<Input
						id="calibracion"
						placeholder="Calibracion"
						value={instrumento.fechaCalibracion.toLocaleDateString("it-IT", {
							day: "2-digit",
							month: "2-digit",
							year: "numeric",
						})}
						readOnly
					/>
				</div>
				<div className="flex flex-col gap-1">
					<Label>Imágenes del Certificado</Label>
					{instrumento.imagenesCalibracion.length > 0 ? (
						<div className="flex w-full grid-cols-4 gap-2 content-center">
							{instrumento.imagenesCalibracion.map(imagen => (
								<div
									key={imagen}
									className="w-full h-20 min-h-9 flex items-center justify-center"
								>
									<img
										src={imagen}
										alt="Imagen del Certificado"
										className="w-full h-full object-contain object-center"
									/>
								</div>
							))}
						</div>
					) : (
						<span className="w-full text-center rounded-lg bg-secondary/20 ring-[1px] ring-foreground/10 p-2.5 text-xs font-medium text-gray-500 italic">
							No has cargado el certificado de calibración
						</span>
					)}
				</div>

				<div className="flex flex-col gap-1">
					<Label>Imágenes Instrumento</Label>
					{instrumento.imagenes.length > 0 ? (
						<div className="flex w-full grid-cols-4 gap-2 content-center">
							{instrumento.imagenes.map(imagen => (
								<div
									key={imagen}
									className="w-full h-20 min-h-9 flex items-center justify-center"
								>
									<img
										src={imagen}
										alt="Imagen del instrumento"
										className="w-full h-full object-contain object-center"
									/>
								</div>
							))}
						</div>
					) : (
						<span className="w-full text-center rounded-lg bg-secondary/20 ring-[1px] ring-foreground/10 p-2.5 text-xs font-medium text-gray-500 italic">
							No has cargado imágenes del instrumento
						</span>
					)}
				</div>
			</div>
			<div className="hidden sm:block">
				{/* <EditInstrumento instrumento={instrumento} /> */}
			</div>
		</div>
	)
}

function InstrumentosVacios() {
	return (
		<div className="w-5/6 h-[30svh] flex flex-col gap-8 items-center justify-center mx-auto my-12">
			<span className="text-sm font-medium text-gray-500 italic text-center text-pretty">
				¡Ups! Parece que no tienes instrumentos registrados
			</span>
			<CreateInstrumento />
		</div>
	)
}

function InstrumentoDropdownMenu({
	instrumento,
}: {
	instrumento: InstrumentoType
}) {
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
					<EditInstrumento
						instrumento={instrumento}
						setIsMenuOpen={setIsMenuOpen}
					/>
					<DropdownMenuSeparator className="bg-foreground/20 w-5/6 mx-auto" />
					<DeleteInstrumento
						instrumento={instrumento}
						setIsMenuOpen={setIsMenuOpen}
					/>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
