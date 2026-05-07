import { useSuspenseQuery } from "@tanstack/react-query"
import type { EmpresaType } from "../../../db/empresas/schema"
import { empresasQueryOptions } from "../../../queries/empresas/empresas-query"
import CreateEmpresa from "./create-empresa"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "../ui/accordion"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { Button } from "../ui/button"
import { Ellipsis } from "lucide-react"
import { useState } from "react"
import { EditEmpresa } from "./edit-empresa"
import DeleteEmpresa from "./delete-empresa"

export default function Empresas() {
	const { data: empresas } = useSuspenseQuery(empresasQueryOptions)
	// const empresas = null
	if (!empresas || empresas.length === 0) return <EmpresasVacias />
	return <HayEmpresas empresas={empresas} />
}

function HayEmpresas({ empresas }: { empresas: EmpresaType[] }) {
	return (
		<div className="w-full flex flex-col gap-2">
			<Accordion
				type="single"
				collapsible
				defaultValue=""
				className="flex flex-col gap-2 w-11/12 mx-auto py-20"
			>
				{empresas.map(empresa => (
					<AccordionItem
						key={empresa.id}
						value={empresa.id}
						className="border-b border-foreground/10 last:border-b-0 py-2"
					>
						<AccordionTrigger className="flex px-5 w-11/12 sm:w-full flex-wrap items-center">
							<div className="flex items-center gap-2 text-sm tracking-wider w-60 sm:w-max truncate">
								{empresa.razonSocial.toUpperCase()} -{" "}
								{empresa.direccion.toUpperCase()} - {empresa.cuit}
							</div>
						</AccordionTrigger>
						<AccordionContent>
							<Empresa empresa={empresa} />
						</AccordionContent>
					</AccordionItem>
				))}
			</Accordion>
			<div className="w-5/6 mx-auto flex justify-end mb-80">
				<CreateEmpresa />
			</div>
		</div>
	)
}

function Empresa({ empresa }: { empresa: EmpresaType }) {
	return (
		<div className="bg-accent sm:bg-background py-20 flex items-center justify-center flex-col relative">
			<div className="sm:hidden block absolute top-10 right-6">
				<EmpresaDropdownMenu empresa={empresa} />
			</div>
			<div className="grid-cols-1 grid sm:grid-cols-2 gap-8 w-5/6 my-10">
				<div className="flex flex-col gap-1">
					<Label className="tracking-wider" htmlFor="razon-social">
						Razón Social
					</Label>
					<Input
						id="razon-social"
						placeholder="Nombre de la empresa"
						value={empresa.razonSocial.toUpperCase()}
						readOnly
						className="bg-background sm:bg-accent text-right"
					/>
				</div>
				<div className="flex flex-col gap-1">
					<Label className="tracking-wider" htmlFor="cuit">
						CUIT
					</Label>
					<Input
						id="cuit"
						placeholder="00-00000000-0"
						value={empresa.cuit}
						readOnly
						className="bg-background sm:bg-accent text-right"
					/>
				</div>
				<div className="flex flex-col gap-1 w-full">
					<Label className="tracking-wider" htmlFor="direccion">
						Dirección
					</Label>
					<Input
						id="direccion"
						placeholder="Calle, Altura"
						value={empresa.direccion.toUpperCase()}
						readOnly
						className="bg-background sm:bg-accent text-right"
					/>
				</div>
				<div className="flex flex-col gap-1 w-full">
					<Label className="tracking-wider" htmlFor="localidad">
						Localidad
					</Label>
					<Input
						id="localidad"
						placeholder="Ciudad, Provincia, Pais"
						value={empresa.localidad.toUpperCase()}
						readOnly
						className="bg-background sm:bg-accent text-right"
					/>
				</div>
				<div className="flex flex-col gap-1 w-full">
					<Label className="tracking-wider" htmlFor="codigoPostal">
						CP
					</Label>
					<Input
						id="codigoPostal"
						placeholder="Ciudad, Provincia, Pais"
						value={empresa.codigoPostal}
						readOnly
						className="bg-background sm:bg-accent text-right"
					/>
				</div>
				<div className="flex flex-col gap-1 w-full">
					<Label className="tracking-wider" htmlFor="provincia">
						Provincia
					</Label>
					<Input
						id="provincia"
						placeholder="Ciudad, Provincia, Pais"
						value={empresa.provincia.toUpperCase()}
						readOnly
						className="bg-background sm:bg-accent text-right"
					/>
				</div>
				<div className="flex flex-col gap-1 w-full">
					<Label htmlFor="horarios">Horarios</Label>
					<Input
						id="horarios"
						placeholder="Lun a Vie 8:00 a 16:00"
						value={empresa.horarios.toUpperCase()}
						readOnly
						className="bg-background sm:bg-accent text-right"
					/>
				</div>
				<div className="flex flex-col gap-1">
					<Label>Logo</Label>
					<div className="card bg-background sm:bg-accent py-2 px-4 rounded-lg flex items-center justify-center">
						<img src="/telefonica.png" alt="luxometro" className="size-20" />
					</div>
				</div>
			</div>
		</div>
	)
}

function EmpresasVacias() {
	return (
		<div className="w-5/6 h-[30svh] flex flex-col gap-8 items-center justify-center mx-auto my-12">
			<span className="text-sm font-medium text-gray-500 italic text-center text-pretty">
				¡Ups! Parece que no tienes empresas registradas
			</span>
			<CreateEmpresa />
		</div>
	)
}

function EmpresaDropdownMenu({ empresa }: { empresa: EmpresaType }) {
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
					<EditEmpresa empresa={empresa} setIsMenuOpen={setIsMenuOpen} />
					<DropdownMenuSeparator className="bg-foreground/20 w-5/6 mx-auto" />
					<DeleteEmpresa empresa={empresa} setIsMenuOpen={setIsMenuOpen} />
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
