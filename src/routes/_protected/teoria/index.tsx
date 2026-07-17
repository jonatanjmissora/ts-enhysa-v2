import IluminacionContent from "#/components/teoria/iluminacion"
import IluminacionValoresRequeridosContent from "#/components/teoria/valor-requerido"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "#/components/ui/select"
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router"
import { ChevronLeft } from "lucide-react"
import { z } from "zod"

const searchSchema = z.object({
	t: z
		.enum([
			"iluminacion",
			"iluminacionValoresRequeridos",
			"ruido",
			"extintores",
			"pat",
		])
		.default("iluminacion"),
	from: z.string().optional().default("root"),
})

export const Route = createFileRoute("/_protected/teoria/")({
	validateSearch: searchSchema,
	component: RouteComponent,
})

const TEORIAS = [
	{ id: "iluminacion", label: "Estudio de Iluminación Res. 84/2012 SRT" },
	{
		id: "iluminacionValoresRequeridos",
		label: "➖ Tabla de Valores Requeridos",
	},
	{ id: "ruido", label: "Estudio de Ruido Res. 84/2012 SRT" },
	{ id: "extintores", label: "Control de Extintores, Recarga y PH" },
	{ id: "pat", label: "Estudio de PAT y Continuidad de las Masas" },
] as const

function RuidoContent() {
	return (
		<p className="text-muted-foreground">
			Contenido próximo — Estudio de Ruido Res. 84/2012 SRT.
		</p>
	)
}

function ExtintoresContent() {
	return (
		<p className="text-muted-foreground">
			Contenido próximo — Control de Extintores, Recarga y PH.
		</p>
	)
}

function PatContent() {
	return (
		<p className="text-muted-foreground">
			Contenido próximo — Estudio de PAT y Continuidad de las Masas.
		</p>
	)
}

const CONTENT: Record<string, () => React.ReactNode> = {
	iluminacion: IluminacionContent,
	iluminacionValoresRequeridos: IluminacionValoresRequeridosContent,
	ruido: RuidoContent,
	extintores: ExtintoresContent,
	pat: PatContent,
}

function RouteComponent() {
	const { t, from } = Route.useSearch()
	const navigate = useNavigate()
	const Content = CONTENT[t]

	return (
		<article className="w-full sm:max-w-5xl mx-auto py-20 px-4 space-y-8">
			<header className="space-y-4">
				<Link
					to={from === "root" ? "/" : from}
					className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
				>
					<ChevronLeft className="size-4" />
					Volver
				</Link>
				<Select
					value={t}
					onValueChange={value =>
						navigate({
							to: "/teoria",
							search: { t: value as typeof t },
							replace: true,
						})
					}
				>
					<SelectTrigger className="w-full text-lg font-semibold h-auto min-h-12 py-3">
						<SelectValue className="text-balance leading-snug" />
					</SelectTrigger>
					<SelectContent>
						{TEORIAS.map(t => (
							<SelectItem key={t.id} value={t.id}>
								{t.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</header>

			<section className="space-y-6">
				<Content />
			</section>
		</article>
	)
}
