import { useSuspenseQuery } from "@tanstack/react-query"
import { tecnicoQueryOptions } from "../../../queries/tecnico/tecnico-query"
import type { TecnicoType } from "../../../db/tecnicos/schema"
import CreateTecnico from "./create-tecnico"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import EditTecnico from "./edit-tecnico"
import { useState } from "react"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { Button } from "../ui/button"
import { Ellipsis } from "lucide-react"
import useScrollTop from "#/hooks/scroll-top"

export default function Tecnico() {
	const { data: tecnico } = useSuspenseQuery(tecnicoQueryOptions)
	// const tecnico = null
	if (!tecnico) return <TecnicoVacio />
	return <HayTecnico tecnico={tecnico} />
}

function HayTecnico({ tecnico }: { tecnico: TecnicoType }) {
	useScrollTop()

	return (
		<div className="w-5/6 mx-auto my-12 mb-80 relative pt-10">
			<div className="absolute top-0 left-6">
				<TecnicoDropdownMenu tecnico={tecnico} />
			</div>
			<div className="grid-cols-1 grid sm:grid-cols-2 gap-8 w-5/6 my-10 mx-auto">
				<div className="flex flex-col gap-1">
					<Label className="tracking-wider" htmlFor="nombre">
						Nombre Completo
					</Label>
					<Input
						id="nombre"
						placeholder="Nombre Completo"
						value={tecnico.nombre.toUpperCase()}
						readOnly
					/>
				</div>
				<div className="flex flex-col gap-1">
					<Label className="tracking-wider" htmlFor="telefono">
						Teléfono
					</Label>
					<Input
						id="telefono"
						placeholder="000-0000000"
						value={tecnico.telefono}
						readOnly
					/>
				</div>
				<div className="flex flex-col gap-1 w-full">
					<Label className="tracking-wider" htmlFor="cargo">
						Cargo
					</Label>
					<Input
						id="cargo"
						placeholder="Ej Técnico SeH"
						value={tecnico.cargo.toUpperCase()}
						readOnly
					/>
				</div>
				<div className="flex flex-col gap-1 w-full">
					<Label className="tracking-wider" htmlFor="localidad">
						Localidad
					</Label>
					<Input
						id="localidad"
						placeholder="Ej. Bahia Blanca"
						value={tecnico.localidad.toUpperCase()}
						readOnly
					/>
				</div>
				<div className="flex flex-col gap-1 w-full">
					<Label className="tracking-wider" htmlFor="matricula">
						Matrícula
					</Label>
					<Input
						id="matricula"
						placeholder="00-00000"
						value={tecnico.matricula}
						readOnly
					/>
				</div>
				<div className="flex flex-col gap-1">
					<Label>Matrícula Digital</Label>
					{tecnico.matriculaImg ? (
						<div className="w-full h-20 min-h-9 flex items-center justify-center">
							<img
								src={tecnico.matriculaImg}
								alt="matricula"
								className="w-full h-full object-contain object-center"
							/>
						</div>
					) : (
						<span className="w-full text-center rounded-lg bg-secondary/20 ring-[1px] ring-foreground/10 p-2.5 text-xs font-medium text-gray-500 italic">
							No has cargado tu matricula digital
						</span>
					)}
				</div>

				<div className="flex-1 flex flex-col gap-1">
					<Label>Firma Digital</Label>
					{tecnico.firmaImg ? (
						<div className="w-full h-20 min-h-9 flex items-center justify-center">
							<img
								src={tecnico.firmaImg}
								alt="Firma digital"
								className="w-max h-full object-contain object-center bg-white"
							/>
						</div>
					) : (
						<span className="w-full text-center rounded-lg bg-secondary/20 ring-[1px] ring-foreground/10 p-2.5 text-xs font-medium text-gray-500 italic">
							No has cargado tu firma digital
						</span>
					)}
				</div>

				<div className="flex-1 flex flex-col gap-1">
					<Label>Empresa Logo</Label>
					{tecnico.empresaLogo ? (
						<div className="w-full h-20 min-h-9 flex items-center justify-center">
							<img
								src={tecnico.empresaLogo}
								alt="Empresa logo"
								className="w-max h-full object-contain object-center bg-white"
							/>
						</div>
					) : (
						<span className="w-full text-center rounded-lg bg-secondary/20 ring-[1px] ring-foreground/10 p-2.5 text-xs font-medium text-gray-500 italic">
							No has cargado el logo de tu empresa
						</span>
					)}
				</div>
			</div>
		</div>
	)
}

function TecnicoVacio() {
	return (
		<div className="w-5/6 h-[30svh] flex flex-col gap-8 items-center justify-center mx-auto my-12">
			<span className="text-sm font-medium text-gray-500 italic">
				No has cargado tus datos aun.
			</span>
			<CreateTecnico />
		</div>
	)
}

function TecnicoDropdownMenu({ tecnico }: { tecnico: TecnicoType }) {
	const [isMenuOpen, setIsMenuOpen] = useState(false)
	return (
		<DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" className="cursor-pointer">
					<Ellipsis className="size-7 text-foreground/50" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="" align="end">
				<DropdownMenuGroup className="flex flex-col gap-4 p-6">
					<EditTecnico tecnico={tecnico} setIsMenuOpen={setIsMenuOpen} />
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
