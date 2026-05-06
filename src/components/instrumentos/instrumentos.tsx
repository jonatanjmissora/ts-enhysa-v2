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
import { instrumentosQueryOptions } from "../../../queries/instrumentos/instrumentos-query"
import type { InstrumentoType } from "../../../db/instrumentos/schema"

export default function Instrumentos() {
	const { data: instrumentos } = useSuspenseQuery(instrumentosQueryOptions)
	// const empresas = null
	if (!instrumentos || instrumentos.length === 0) return <InstrumentosVacias />
	return <HayInstrumentos instrumentos={instrumentos} />
}

function HayInstrumentos({ instrumentos }: { instrumentos: InstrumentoType[] }) {
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
		
	)
}

function InstrumentosVacias() {
	return (
		<div className="w-5/6 h-[30svh] flex flex-col gap-4 items-center justify-center mx-auto my-12">
			<span className="text-sm font-medium text-gray-500 italic">
				¡Ups! Parece que no tienes instrumentos registrados
			</span>
			{/* <CreateInstrumento /> */}
		</div>
	)
}
