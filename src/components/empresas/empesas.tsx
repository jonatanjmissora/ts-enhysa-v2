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
import { Ellipsis, Pencil } from "lucide-react"
import { useState } from "react"
import DeleteEmpresa from "./delete-empresa"
import { Link } from "@tanstack/react-router"

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
						<AccordionTrigger className="flex px-5 w-11/12 sm:w-full flex-wrap items-center bg-accent ring-[1px] dark:ring-foreground/10 ring-foreground/50">
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
			<div className="absolute top-10 left-6">
				<EmpresaDropdownMenu empresa={empresa} />
			</div>
			<div className="grid-cols-1 grid sm:grid-cols-2 gap-8 w-5/6 my-10">
				<div className="flex flex-col gap-1">
					<Label
						className="tracking-wider text-amber-700"
						htmlFor="razon-social"
					>
						Razón Social
					</Label>
					<Input
						onFocus={e => e.target.select()}
						id="razon-social"
						placeholder="Nombre de la empresa"
						value={empresa.razonSocial.toUpperCase()}
						readOnly
					/>
				</div>
				<div className="flex flex-col gap-1">
					<Label className="tracking-wider text-amber-700" htmlFor="cuit">
						CUIT
					</Label>
					<Input
						onFocus={e => e.target.select()}
						id="cuit"
						placeholder="00-00000000-0"
						value={empresa.cuit}
						readOnly
					/>
				</div>
				<div className="flex flex-col gap-1 w-full">
					<Label className="tracking-wider text-amber-700" htmlFor="direccion">
						Dirección
					</Label>
					<Input
						onFocus={e => e.target.select()}
						id="direccion"
						placeholder="Calle, Altura"
						value={empresa.direccion.toUpperCase()}
						readOnly
					/>
				</div>
				<div className="flex flex-col gap-1 w-full">
					<Label className="tracking-wider text-amber-700" htmlFor="localidad">
						Localidad
					</Label>
					<Input
						onFocus={e => e.target.select()}
						id="localidad"
						placeholder="Ciudad, Provincia, Pais"
						value={empresa.localidad.toUpperCase()}
						readOnly
					/>
				</div>
				<div className="flex flex-col gap-1 w-full">
					<Label
						className="tracking-wider text-amber-700"
						htmlFor="codigoPostal"
					>
						CP
					</Label>
					<Input
						onFocus={e => e.target.select()}
						id="codigoPostal"
						placeholder="Ciudad, Provincia, Pais"
						value={empresa.codigoPostal}
						readOnly
					/>
				</div>
				<div className="flex flex-col gap-1 w-full">
					<Label className="tracking-wider text-amber-700" htmlFor="provincia">
						Provincia
					</Label>
					<Input
						onFocus={e => e.target.select()}
						id="provincia"
						placeholder="Ciudad, Provincia, Pais"
						value={empresa.provincia.toUpperCase()}
						readOnly
					/>
				</div>
				<div className="flex flex-col gap-1 w-full">
					<Label htmlFor="horarios" className="tracking-wider text-amber-700">
						Horarios
					</Label>
					<Input
						onFocus={e => e.target.select()}
						id="horarios"
						placeholder="Lun a Vie 8:00 a 16:00"
						value={empresa.horarios.toUpperCase()}
						readOnly
					/>
				</div>
				<div className="flex flex-col gap-1">
					<Label className="tracking-wider text-amber-700">Logo</Label>
					{empresa.logo ? (
						<div className="w-full h-20 min-h-9 flex items-center justify-center">
							<img
								src={empresa.logo}
								alt="Imágen Logo"
								className="w-full h-full object-contain object-center"
							/>
						</div>
					) : (
						<span className="w-full text-center rounded-lg bg-secondary/20 ring-[1px] ring-foreground/10 p-2.5 text-xs font-medium text-gray-500 italic">
							No has cargado el logo de la empresa
						</span>
					)}
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
					<Link
						to="/perfil/empresas/$id/editar"
						params={{ id: empresa.id }}
						onClick={() => setIsMenuOpen(false)}
						className="w-full flex items-center gap-2 p-4 rounded-md hover:bg-background"
					>
						<Pencil size={14} className="text-foreground" />
						Editar
					</Link>
					<DropdownMenuSeparator className="bg-foreground/20 w-5/6 mx-auto" />
					<DeleteEmpresa empresa={empresa} setIsMenuOpen={setIsMenuOpen} />
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
