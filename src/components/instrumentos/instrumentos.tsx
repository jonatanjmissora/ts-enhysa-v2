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
						<AccordionTrigger className="flex px-5 w-11/12 sm:w-full flex-wrap items-center">
							<div className="flex items-center gap-2 text-sm tracking-wider w-60 sm:w-max truncate">
								{instrumento.nombre.toUpperCase()} -{" "}
								{instrumento.modelo.toUpperCase()}
							</div>
						</AccordionTrigger>
						<AccordionContent>
							<Instrumento instrumento={instrumento} />
						</AccordionContent>
					</AccordionItem>
				))}
			</Accordion>
			<div className="w-5/6 mx-auto flex justify-end">
				{/* <CreateInstrumento /> */}
			</div>
		</div>
	)
}

function Instrumento({ instrumento }: { instrumento: InstrumentoType }) {
	return (
		<div className="bg-accent py-10 sm:p-10 flex items-center justify-center flex-col relative">
			{/* <div className="hidden sm:block">
				<DeleteInstrumento instrumento={instrumento} />
			</div>
			<div className="sm:hidden block absolute top-6 right-6">
				<InstrumentoDropdownMenu instrumento={instrumento} />
			</div> */}
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
						className="bg-background sm:bg-accent"
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
						className="bg-background sm:bg-accent"
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
						className="bg-background sm:bg-accent"
					/>
				</div>
				<div className="flex flex-col gap-1">
					<Label className="tracking-wider" htmlFor="calibracion">
						Calibración
					</Label>
					<Input
						id="calibracion"
						placeholder="Calibracion"
						value={instrumento.fechaCalibracion}
						readOnly
						className="bg-background sm:bg-accent"
					/>
				</div>
				<div className="flex flex-col gap-1">
					<Label>Imágenes</Label>
					<div className="card bg-background sm:bg-accent py-2 px-4 rounded-lg flex items-center justify-center">
						<img src="/luxometro.jpg" alt="luxometro" className="size-20" />
					</div>
				</div>

				<div className="flex flex-col gap-1">
					<Label>Certificado</Label>
					<div className="card bg-background sm:bg-accent py-2 px-4 rounded-lg flex items-center justify-center">
						<img src="/calibracion.webp" alt="luxometro" className="size-20" />
					</div>
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
			{/* <CreateInstrumento /> */}
		</div>
	)
}
