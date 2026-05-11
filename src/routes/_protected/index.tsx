import Plan from "#/components/plan"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "#/components/ui/select"
import useScrollTop from "#/hooks/scroll-top"
import { PROTOCOLOS } from "#/lib/constants"
import { createFileRoute, Link } from "@tanstack/react-router"
import {
	ClipboardList,
	Factory,
	FileCheck,
	HeartPulse,
	ShieldCheck,
} from "lucide-react"

export const Route = createFileRoute("/_protected/")({ component: Home })

function Home() {
	useScrollTop()

	return (
		<article className="w-full min-h-svh flex flex-col items-center justify-center gap-20">
			<div className="flex justify-between items-center flex-col mt-[70px] h-[550px] relative overflow-visible px-6">
				<p className="text-[26px] text-center tracking-wider text-pretty px-3 dark:text-shadow-lg">
					Selecciona tu nuevo informe.
				</p>
				<img
					src="/movil-hero.webp"
					alt="logo EnHySa"
					className="absolute opacity-75 top-6 left-0 w-screen h-[500px] bottom-0 -z-10 max-w-none mask-t-from-50% mask-b-from-80%"
				/>
				<Select>
					<SelectTrigger className="w-11/12 ring-[1px] ring-foreground/30 py-6 tracking-widest font-semibold text-base bg-secondary">
						<SelectValue placeholder="Selecciona un protocolo" />
					</SelectTrigger>
					<SelectContent className="w-80 mx-auto truncate">
						{PROTOCOLOS.map(protocolo => (
							<SelectItem
								key={protocolo.id}
								value={protocolo.id}
								className="text-right! text-nowrap! flex justify-start! py-2"
							>
								<Link to={protocolo.link} resetScroll={true}>
									{protocolo.title}
								</Link>
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<div className="flex flex-col gap-20 w-5/6 mx-auto my-20">
				<div className="">
					<div className="shapeLeft flex items-center justify-center flex-col gap-2 bg-secondary/50 ring-[1px] ring-amber-500/20 rounded-md p-4 mr-4 text-amber-600">
						<ShieldCheck size={30} />
						Protocolo
					</div>
					<p className="text-sm tracking-wider italic text-foreground/60">
						Cumplir con los protocolos de seguridad ayuda a reducir riesgos,
						prevenir lesiones y evitar accidentes dentro del entorno laboral.
						Los informes permiten detectar fallas antes de que se conviertan en
						problemas graves. Además, una correcta prevención protege tanto a
						los trabajadores como a la continuidad operativa de la empresa.
					</p>
				</div>

				<div className="">
					<div className="shapeRight flex items-center justify-center flex-col gap-2 bg-secondary/50 ring-[1px] ring-amber-500/20 rounded-md p-4 ml-4 text-amber-600">
						<HeartPulse size={30} />
						Saludable
					</div>
					<p className="text-sm tracking-wider italic text-foreground/60">
						Las normas e inspecciones de seguridad e higiene garantizan
						condiciones de trabajo más saludables, reduciendo la exposición a
						sustancias peligrosas, ruidos excesivos o malas condiciones
						ambientales. Esto contribuye a mejorar la calidad de vida y el
						bienestar diario de los empleados.
					</p>
				</div>

				<div className="">
					<div className="shapeLeft flex items-center justify-center flex-col gap-2 bg-secondary/50 ring-[1px] ring-amber-500/20 rounded-md p-4 mr-4 text-amber-600">
						<FileCheck size={30} />
						Cumplir
					</div>
					<p className="text-sm tracking-wider italic text-foreground/60">
						Los técnicos elaboran informes que ayudan a la empresa a cumplir con
						las leyes laborales y regulaciones vigentes, evitando multas,
						sanciones o clausuras. Mantener la documentación actualizada también
						demuestra responsabilidad y compromiso institucional.
					</p>
				</div>

				<div className="">
					<div className="shapeRight flex items-center justify-center flex-col gap-2 bg-secondary/50 ring-[1px] ring-amber-500/20 rounded-md p-4 ml-4 text-amber-600">
						<Factory size={30} />
						Empresa
					</div>
					<p className="text-sm tracking-wider italic text-foreground/60">
						Un espacio de trabajo seguro y ordenado genera mayor confianza en
						los empleados, disminuye ausencias por accidentes y mejora el
						rendimiento general de la empresa. Cuando las personas trabajan en
						un entorno seguro, se sienten más motivadas y comprometidas con sus
						tareas.
					</p>
				</div>

				<div className="">
					<div className="shapeLeft flex items-center justify-center flex-col gap-2 bg-secondary/50 ring-[1px] ring-amber-500/20 rounded-md p-4 mr-4 text-amber-600">
						<ClipboardList size={30} />
						Seguimiento
					</div>
					<p className="text-sm tracking-wider italic text-foreground/60">
						Los informes técnicos sirven como documentación oficial para
						controlar riesgos, realizar auditorías y planificar mejoras
						continuas en seguridad e higiene. Gracias a este seguimiento, la
						empresa puede tomar decisiones preventivas y actuar rápidamente ante
						posibles problemas.
					</p>
				</div>
			</div>

			<Plan />
		</article>
	)
}
