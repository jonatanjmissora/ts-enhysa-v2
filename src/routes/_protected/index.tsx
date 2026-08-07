import Plan from "#/components/plan"
import useScrollTop from "#/hooks/scroll-top"
import { useInstallVerification } from "#/hooks/use-install-verification"
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
	useInstallVerification()
	const cardBg =
		"bg-[radial-gradient(ellipse_at_bottom_left,rgba(225,113,0,0.5)_0%,transparent_65%)] dark:bg-[radial-gradient(ellipse_at_bottom_left,rgba(225,113,0,0.1)_0%,transparent_65%)]"

	return (
		<article className="w-full sm:max-w-5xl 2xl:max-w-7xl sm:mx-auto min-h-svh flex flex-col items-center justify-center gap-20">
			<div className="flex justify-between items-center flex-col mt-17 sm:mt-10 h-150 sm:h-180 relative overflow-visible px-6 w-full sm:w-5/6 mx-auto">
				<p className="text-[26px] sm:text-[30px] 2xl:text-[36px] text-center tracking-wider text-pretty px-3">
					Selecciona tu nuevo informe.
				</p>
				<img
					src="/hero.webp"
					alt="logo EnHySa"
					className="absolute opacity-75  left-0 w-full h-130 sm:h-full bottom-0 -z-10 max-w-none  object-cover sm:mask-radial sm:mask-radial-from-60% sm:mask-radial-to-90% sm:mask-l-from-95% sm:mask-l-to-100% sm:mask-r-from-95% sm:mask-r-to-100% mask-t-from-70% mask-t-to-100% mask-b-from-70% mask-b-to-100%"
				/>
				<Icons />
			</div>
			<Link
				to="/teoria/presupuesto"
				className="w-11/12 italic text-foreground-soft tracking-wider text-sm underline text-right"
			>
				Cotizador Profesional HSE
			</Link>

			<div className="flex flex-col gap-20 w-5/6 mx-auto my-20">
				<div className="">
					<div
						className={`shapeLeft flex items-center justify-center flex-col gap-2 bg-accent/50 ring-[1px] dark:ring-amber-500/20 ring-amber-700/40 rounded-md p-4 mr-4 dark:text-amber-600 text-amber-800 ${cardBg}`}
					>
						<ShieldCheck size={30} />
						Protocolo
					</div>
					<p className="text-sm tracking-wider italic text-foreground-soft">
						Cumplir con los protocolos de seguridad ayuda a reducir riesgos,
						prevenir lesiones y evitar accidentes dentro del entorno laboral.
						Los informes permiten detectar fallas antes de que se conviertan en
						problemas graves. Además, una correcta prevención protege tanto a
						los trabajadores como a la continuidad operativa de la empresa.
					</p>
				</div>

				<div className="">
					<div
						className={`shapeRight flex items-center justify-center flex-col gap-2 bg-accent/50 ring-[1px] dark:ring-amber-500/20 ring-amber-700/40 rounded-md p-4 ml-4 dark:text-amber-600 text-amber-800 ${cardBg}`}
					>
						<HeartPulse size={30} />
						Saludable
					</div>
					<p className="text-sm tracking-wider italic text-foreground-soft">
						Las normas e inspecciones de seguridad e higiene garantizan
						condiciones de trabajo más saludables, reduciendo la exposición a
						sustancias peligrosas, ruidos excesivos o malas condiciones
						ambientales. Esto contribuye a mejorar la calidad de vida y el
						bienestar diario de los empleados.
					</p>
				</div>

				<div className="">
					<div
						className={`shapeLeft flex items-center justify-center flex-col gap-2 bg-accent/50 ring-[1px] dark:ring-amber-500/20 ring-amber-700/40 rounded-md p-4 mr-4 dark:text-amber-600 text-amber-800 ${cardBg}`}
					>
						<FileCheck size={30} />
						Cumplir
					</div>
					<p className="text-sm tracking-wider italic text-foreground-soft">
						Los técnicos elaboran informes que ayudan a la empresa a cumplir con
						las leyes laborales y regulaciones vigentes, evitando multas,
						sanciones o clausuras. Mantener la documentación actualizada también
						demuestra responsabilidad y compromiso institucional.
					</p>
				</div>

				<div className="">
					<div
						className={`shapeRight flex items-center justify-center flex-col gap-2 bg-accent/50 ring-[1px] dark:ring-amber-500/20 ring-amber-700/40 rounded-md p-4 ml-4 dark:text-amber-600 text-amber-800 ${cardBg}`}
					>
						<Factory size={30} />
						Empresa
					</div>
					<p className="text-sm tracking-wider italic text-foreground-soft">
						Un espacio de trabajo seguro y ordenado genera mayor confianza en
						los empleados, disminuye ausencias por accidentes y mejora el
						rendimiento general de la empresa. Cuando las personas trabajan en
						un entorno seguro, se sienten más motivadas y comprometidas con sus
						tareas.
					</p>
				</div>

				<div className="">
					<div
						className={`shapeLeft flex items-center justify-center flex-col gap-2 bg-accent/50 ring-[1px] dark:ring-amber-500/20 ring-amber-700/40 rounded-md p-4 mr-4 dark:text-amber-600 text-amber-800 ${cardBg}`}
					>
						<ClipboardList size={30} />
						Seguimiento
					</div>
					<p className="text-sm tracking-wider italic text-foreground-soft">
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

function Icons() {
	const ICON_HEIGHT = 90

	// 		   	4
	// 	  2  		7
	// 1		  5		9
	//    3   	    8
	//   		  6
	const iconsArray = [
		{
			id: 2,
			nombre: "iluminacion",
			link: "/iluminacion",
			top: "16.5%",
			left: "29%",
			icon: "/icon-iluminacion.webp",
		},
		{
			id: 4,
			nombre: "capacitaciones",
			link: "/capacitaciones",
			top: "0%",
			left: "50%",
			icon: "/icon-capacitaciones.webp",
		},
		{
			id: 7,
			nombre: "ruido",
			link: "/ruido",
			top: "17%",
			left: "71%",
			icon: "/icon-ruido.webp",
		},
		{
			id: 3,
			nombre: "antisiniestral",
			link: "/antisiniestral",
			top: "51.5%",
			left: "29%",
			icon: "/icon-antisiniestral.webp",
		},
		{
			id: 5,
			nombre: "teoria",
			link: "/teoria",
			top: "34%",
			left: "50%",
			icon: "/icon-hse.webp",
		},
		{
			id: 8,
			nombre: "epp",
			link: "/epp",
			top: "51.5%",
			left: "71.5%",
			icon: "/icon-epp.webp",
		},
		{
			id: 6,
			nombre: "vehiculos",
			link: "/vehiculos",
			top: "70%",
			left: "50%",
			icon: "/icon-vehiculos.webp",
		},
		{
			id: 1,
			nombre: "extintores",
			link: "/extintores",
			top: "34%",
			left: "7%",
			icon: "/icon-extintores.webp",
		},
		{
			id: 9,
			nombre: "pat",
			link: "/pat",
			top: "34%",
			left: "93.5%",
			icon: "/icon-pat.webp",
		},
	]
	return (
		<div
			className="relative w-full sm:scale-140 origin-bottom"
			style={{ height: ICON_HEIGHT * 2.5, width: ICON_HEIGHT * 3.5 }}
		>
			{iconsArray.map(icon => (
				<Link
					key={icon.nombre}
					to={icon.link}
					style={{
						top: icon.top,
						left: icon.left,
						transform: "translateX(-50%)",
						height: ICON_HEIGHT,
						aspectRatio: "1 / 1",
					}}
					className={`absolute -translate-y-12 sm:-translate-y-20 2xl:-translate-y-10`}
				>
					<img src={icon.icon} alt={icon.nombre} />
				</Link>
			))}
		</div>
	)
}
