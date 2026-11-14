import { useSuspenseQuery } from "@tanstack/react-query"
import { tecnicosQueryOptions } from "../../../queries/tecnico/tecnicos-query"
import type { TecnicoType } from "../../../db/tecnicos/schema"
import CreateTecnico from "./create-tecnico"
import EditTecnico from "./edit-tecnico"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "../ui/accordion"
import { ImageWithFallback } from "../ui/image-with-fallback"
import useScrollTop from "#/hooks/scroll-top"

export default function Tecnicos() {
	const { data: tecnicos } = useSuspenseQuery(tecnicosQueryOptions)

	if (!tecnicos || tecnicos.length === 0) return <TecnicosVacios />

	return <HayTecnicos tecnicos={tecnicos} />
}

function HayTecnicos({ tecnicos }: { tecnicos: TecnicoType[] }) {
	useScrollTop()

	return (
		<div className="w-full flex flex-col gap-2">
			<Accordion
				type="single"
				collapsible
				defaultValue=""
				className="flex flex-col gap-2 w-11/12 mx-auto py-20"
			>
				{tecnicos.map(tecnico => (
					<AccordionItem
						key={tecnico.id}
						value={tecnico.id}
						className="border-b border-foreground/10 last:border-b-0 py-2"
					>
						<AccordionTrigger className="flex px-5 w-11/12 sm:w-full flex-wrap items-center bg-accent ring-[1px] dark:ring-foreground/10 ring-foreground/50">
							<div className="flex items-center gap-2 text-sm tracking-wider w-60 sm:w-max truncate">
								{tecnico.nombre.toUpperCase()} - {tecnico.matricula}
							</div>
						</AccordionTrigger>
						<AccordionContent>
							<Tecnico tecnico={tecnico} />
						</AccordionContent>
					</AccordionItem>
				))}
			</Accordion>
			<div className="w-5/6 mx-auto flex justify-end mb-80">
				<CreateTecnico />
			</div>
		</div>
	)
}

function Tecnico({ tecnico }: { tecnico: TecnicoType }) {
	return (
		<div className="bg-accent sm:bg-background py-20 flex items-center justify-center flex-col relative">
			<div className="absolute top-10 left-6">
				<EditTecnico tecnico={tecnico} />
			</div>
			<div className="grid-cols-1 grid sm:grid-cols-2 gap-8 w-5/6 my-10 mx-auto">
				<div className="flex flex-col gap-1">
					<Label className="tracking-wider text-amber-700" htmlFor="nombre">
						Nombre Completo
					</Label>
					<Input
						onFocus={e => e.target.select()}
						id="nombre"
						placeholder="Nombre Completo"
						value={tecnico.nombre.toUpperCase()}
						readOnly
					/>
				</div>
				<div className="flex flex-col gap-1">
					<Label className="tracking-wider text-amber-700" htmlFor="telefono">
						Teléfono
					</Label>
					<Input
						onFocus={e => e.target.select()}
						id="telefono"
						placeholder="000-0000000"
						value={tecnico.telefono}
						readOnly
					/>
				</div>
				<div className="flex flex-col gap-1 w-full">
					<Label className="tracking-wider text-amber-700" htmlFor="cargo">
						Cargo
					</Label>
					<Input
						onFocus={e => e.target.select()}
						id="cargo"
						placeholder="Ej Técnico SeH"
						value={tecnico.cargo.toUpperCase()}
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
						placeholder="Ej. Bahia Blanca"
						value={tecnico.localidad.toUpperCase()}
						readOnly
					/>
				</div>
				<div className="flex flex-col gap-1 w-full">
					<Label className="tracking-wider text-amber-700" htmlFor="matricula">
						Matrícula
					</Label>
					<Input
						onFocus={e => e.target.select()}
						id="matricula"
						placeholder="00-00000"
						value={tecnico.matricula}
						readOnly
					/>
				</div>
				<div className="flex flex-col gap-1 w-full">
					<Label className="tracking-wider text-amber-700" htmlFor="dni">
						DNI
					</Label>
					<Input
						onFocus={e => e.target.select()}
						id="dni"
						placeholder="Sin DNI"
						value={tecnico.dni ?? ""}
						readOnly
					/>
				</div>
				<div className="flex flex-col gap-1">
					<Label className="tracking-wider text-amber-700">
						Matrícula Digital
					</Label>
					{tecnico.matriculaImg ? (
						<div className="w-full h-20 min-h-9 flex items-center justify-center">
							<ImageWithFallback
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
					<Label className="tracking-wider text-amber-700">Firma Digital</Label>
					{tecnico.firmaImg ? (
						<div className="w-full h-20 min-h-9 flex items-center justify-center">
							<ImageWithFallback
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
					<Label className="tracking-wider text-amber-700">Empresa Logo</Label>
					{tecnico.empresaLogo ? (
						<div className="w-full h-20 min-h-9 flex items-center justify-center">
							<ImageWithFallback
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

function TecnicosVacios() {
	return (
		<div className="w-5/6 h-[30svh] flex flex-col gap-8 items-center justify-center mx-auto my-12">
			<span className="text-sm font-medium text-gray-500 italic">
				No has cargado tus datos aun.
			</span>
			<CreateTecnico />
		</div>
	)
}
