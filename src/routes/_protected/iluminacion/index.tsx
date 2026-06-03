import InformesRecientes from "#/components/reportes/iluminacion/recientes"
import { createFileRoute, Link } from "@tanstack/react-router"
import {
	AlignEndHorizontal,
	Calendar,
	ChartPie,
	FileChartColumn,
	Handshake,
} from "lucide-react"

export const Route = createFileRoute("/_protected/iluminacion/")({
	component: RouteComponent,
})

function RouteComponent() {
	const id = crypto.randomUUID().toString()
	return (
		<article className="w-full sm:max-w-5xl 2xl:max-w-7xl sm:mx-auto min-h-svh flex flex-col items-center justify-center gap-20">
			<div className="flex justify-between items-center flex-col mt-[70px] sm:mt-10 h-[550px] sm:h-[450px] relative overflow-visible px-6 sm:w-2/3 mx-auto">
				<p className="text-[26px] text-center tracking-wider text-pretty px-0">
					Informes de iluminación SRT 84/12.
				</p>
				<img
					src="/movil-hero-light-meter.webp"
					alt="logo EnHySa"
					className="absolute opacity-75 top-6 left-0 w-screen sm:w-full h-[500px] sm:h-[400px] bottom-0 -z-10 max-w-none mask-t-from-50% mask-b-from-80% sm:mask-r-from-95% sm:mask-l-from-5% object-cover object-[50%_40%]"
				/>
				<Link
					to="/iluminacion/reportes/$id/crud/create-general"
					params={{
						id,
					}}
					className="py-3 w-11/12 sm:w-1/2 mx-auto tracking-widest font-semibold text-base bg-primary rounded-lg flex gap-2 items-center justify-center ring-[1px] ring-foreground/25"
				>
					<FileChartColumn size={20} />
					Nuevo Informe
				</Link>
			</div>

			<InformesRecientes />

			<div className="flex flex-col gap-6 w-5/6 mx-auto  mt-10 mb-40">
				<span className="text-pretty text-sm tracking-wider italic text-foreground/60">
					El informe o Protocolo de Medición de Iluminación SRT 84/12 es un
					documento obligatorio en Argentina que estandariza la medición de la
					luz en los lugares de trabajo para garantizar niveles seguros,
					confortables y prevenir la fatiga visual o accidentes.
				</span>
				<span className="text-pretty text-sm tracking-wider italic text-foreground/60">
					Debe realizarse anualmente por profesionales para cumplir con la
					normativa de higiene y seguridad.
				</span>
				<span className="mt-10 mb-4 text-pretty tracking-wider italic text-foreground/60">
					<b className="text-foreground py-1 border-b border-foreground/50">
						Aspectos clave de la Res. 84/12 SRT:
					</b>
				</span>

				<div className="flex flex-col gap-20">
					<div className="dark:text-amber-600 text-amber-800">
						<div className="shapeLeft flex items-center justify-center flex-col gap-2 bg-accent/50 ring-[1px] dark:ring-amber-500/20 ring-amber-700/40 rounded-md p-4 mr-4">
							<AlignEndHorizontal size={30} />
							Finalidad
						</div>
						<p className="text-sm tracking-wider italic text-foreground/60">
							Medir la iluminancia (en luxes) en puestos de trabajo para
							asegurar que cumple con la Resolución 295/03, garantizando confort
							visual y seguridad.
						</p>
					</div>

					<div className="">
						<div className="shapeRight flex items-center justify-center flex-col gap-2 bg-accent/50 ring-[1px] dark:ring-amber-500/20 ring-amber-700/40 rounded-md p-4 ml-4 dark:text-amber-600 text-amber-800">
							<Handshake size={30} />
							Obligatorio
						</div>
						<p className="text-sm tracking-wider italic text-foreground/60">
							Aplica a todos los establecimientos con trabajadores en relación
							de dependencia.
						</p>
					</div>

					<div className="">
						<div className="shapeLeft flex items-center justify-center flex-col gap-2 bg-accent/50 ring-[1px] dark:ring-amber-500/20 ring-amber-700/40 rounded-md p-4 mr-4 dark:text-amber-600 text-amber-800">
							<ChartPie size={30} />
							Metodo
						</div>
						<p className="text-sm tracking-wider italic text-foreground/60">
							Establece un método estandarizado de medición (método de la
							cuadrícula) y un formato de planilla unificado (Planilla A) para
							que los resultados sean válidos ante la ART o el Ministerio de
							Trabajo.
						</p>
					</div>

					<div className="">
						<div className="shapeRight flex items-center justify-center flex-col gap-2 bg-accent/50 ring-[1px] dark:ring-amber-500/20 ring-amber-700/40 rounded-md p-4 ml-4 dark:text-amber-600 text-amber-800">
							<Calendar size={30} />
							Validez
						</div>
						<p className="text-sm tracking-wider italic text-foreground/60">
							Las mediciones tienen una validez de 12 meses, o menos si se
							modifican los puestos de tabajo. Contenido: El informe incluye
							datos del establecimiento, el luxómetro utilizado, croquis del
							lugar, resultados de las mediciones y la firma del profesional
							responsable.
						</p>
					</div>
				</div>

				<span className="mt-10 text-pretty text-sm tracking-wider italic text-foreground/60">
					El incumplimiento de este protocolo puede derivar en observaciones de
					la ART y multas.
				</span>
			</div>
		</article>
	)
}
