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
		.enum(["iluminacion", "ruido", "extintores", "pat"])
		.default("iluminacion"),
	from: z.enum(["root", "landing"]).default("root"),
})

export const Route = createFileRoute("/_protected/teoria/")({
	validateSearch: searchSchema,
	component: RouteComponent,
})

const TEORIAS = [
	{ id: "iluminacion", label: "Estudio de Iluminación Res. 84/2012 SRT" },
	{ id: "ruido", label: "Estudio de Ruido Res. 84/2012 SRT" },
	{ id: "extintores", label: "Control de Extintores, Recarga y PH" },
	{ id: "pat", label: "Estudio de PAT y Continuidad de las Masas" },
] as const

function IluminacionContent() {
	return (
		<>
			<p className="text-muted-foreground">
				Decreto 351/79 - Anexo IV y Resolución SRT 84/2012. Exigencias mínimas
				de iluminación en la República Argentina.
			</p>

			<section className="space-y-4">
				<h2 className="text-xl font-semibold">
					Niveles Mínimos de Iluminación
				</h2>
				<p className="text-sm text-muted-foreground">
					El Decreto 351/79 (Anexo IV) establece los lux mínimos según la
					dificultad de la tarea visual:
				</p>
				<div className="overflow-x-auto rounded-xl border">
					<table className="w-full text-sm">
						<thead>
							<tr className="bg-muted/50">
								<th className="text-left p-3 font-medium">Tarea</th>
								<th className="text-left p-3 font-medium">
									Iluminancia Mínima
								</th>
							</tr>
						</thead>
						<tbody className="divide-y">
							<tr>
								<td className="p-3">Pasillos y zonas de circulación general</td>
								<td className="p-3 font-mono">50 Lux</td>
							</tr>
							<tr>
								<td className="p-3">
									Tareas con requerimiento visual simple (Depósitos)
								</td>
								<td className="p-3 font-mono">100 — 200 Lux</td>
							</tr>
							<tr>
								<td className="p-3">
									Trabajos de oficina general, lectura y pantallas
								</td>
								<td className="p-3 font-mono">300 Lux</td>
							</tr>
							<tr>
								<td className="p-3">
									Tareas de alta precisión o talleres de control
								</td>
								<td className="p-3 font-mono">500 — 1000 Lux</td>
							</tr>
						</tbody>
					</table>
				</div>
			</section>

			<section className="space-y-4">
				<h2 className="text-xl font-semibold">Interpretación</h2>
				<ul className="space-y-3 text-sm">
					<li className="flex gap-3">
						<span className="font-mono text-xs font-bold text-muted-foreground shrink-0 mt-0.5">
							50 Lux
						</span>
						<span>
							Solo para tránsito peatonal sin riesgo. No se realiza ninguna
							tarea visual continua en estos sectores.
						</span>
					</li>
					<li className="flex gap-3">
						<span className="font-mono text-xs font-bold text-muted-foreground shrink-0 mt-0.5">
							100–200 Lux
						</span>
						<span>
							Tareas gruesas donde el detalle no es crítico. Aplica a depósitos,
							almacenes y zonas de paso donde se manipulan objetos grandes.
						</span>
					</li>
					<li className="flex gap-3">
						<span className="font-mono text-xs font-bold text-muted-foreground shrink-0 mt-0.5">
							300 Lux
						</span>
						<span>
							Umbral para trabajo administrativo y visual continuo. Oficinas,
							lectura prolongada, uso de pantallas y tareas de escritorio en
							general.
						</span>
					</li>
					<li className="flex gap-3">
						<span className="font-mono text-xs font-bold text-muted-foreground shrink-0 mt-0.5">
							500–1000 Lux
						</span>
						<span>
							Tareas finas que requieren agudeza visual sostenida: control de
							calidad, laboratorios, montaje fino, talleres de precisión.
						</span>
					</li>
				</ul>
			</section>

			<section className="space-y-4">
				<h2 className="text-xl font-semibold">Protocolo SRT 84/2012</h2>
				<p className="text-sm text-muted-foreground">
					La Resolución SRT 84/2012 define el procedimiento obligatorio para la
					medición y registro de los niveles de iluminación en los
					establecimientos laborales.
				</p>
				<ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
					<li>Registro del lux media, uniformidad y factor de mantenimiento</li>
					<li>Croquis del sector con puntos de medición</li>
					<li>Datos del instrumento (luxómetro calibrado)</li>
					<li>Firma del profesional interviniente</li>
					<li>
						Vigencia máxima de 12 meses (salvo modificaciones del entorno)
					</li>
				</ul>
			</section>
		</>
	)
}

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
	ruido: RuidoContent,
	extintores: ExtintoresContent,
	pat: PatContent,
}

function RouteComponent() {
	const { t, from } = Route.useSearch()
	const navigate = useNavigate()
	const Content = CONTENT[t]

	return (
		<article className="w-full sm:max-w-3xl mx-auto py-10 px-4 space-y-8">
			<header className="space-y-4">
				<Link
					to={from === "landing" ? "/landing" : "/"}
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
