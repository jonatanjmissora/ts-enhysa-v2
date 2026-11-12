import { Link } from "@tanstack/react-router"

export default function Modules() {
	const items = [
		{
			dot: "bg-[#5cb85c]",
			borderColor: "border-[#5cb85c60]",
			bg: "bg-zinc-300 dark:bg-zinc-900 dark:bg-[radial-gradient(ellipse_at_bottom_left,rgba(92,184,92,0.1)_0%,transparent_65%)] bg-[radial-gradient(ellipse_at_bottom_left,rgba(92,184,92,0.35)_0%,transparent_65%)]",
			title: "Estudio de Iluminación",
			desc: "Protocolo oficial según Res. 84/2012 SRT. Gestión de luminarias y fuentes mixtas.",
			t: "iluminacion",
			actual: "true",
		},
		{
			dot: "bg-[#e2711d]",
			borderColor: "border-[#e2711d60]",
			bg: "bg-zinc-300 dark:bg-zinc-900 dark:bg-[radial-gradient(ellipse_at_bottom_left,rgba(226,113,29,0.1)_0%,transparent_65%)] bg-[radial-gradient(ellipse_at_bottom_left,rgba(226,113,29,0.35)_0%,transparent_65%)]",
			title: "Estudio de Ruido",
			desc: "Evaluación de puestos de trabajo conforme a la Res. 85/2012 SRT.",
			t: "ruido",
			actual: "false",
		},
		{
			dot: "bg-[#5197ff]",
			borderColor: "border-[#5197ff60]",
			bg: "bg-zinc-300 dark:bg-zinc-900 dark:bg-[radial-gradient(ellipse_at_bottom_left,rgba(81,151,255,0.1)_0%,transparent_65%)] bg-[radial-gradient(ellipse_at_bottom_left,rgba(81,151,255,0.35)_0%,transparent_65%)]",
			title: "Puesta a Tierra (PAT)",
			desc: "Verificación de continuidad de masas y resistencia bajo la Res. 900/15 SRT.",
			t: "pat",
			actual: "false",
		},
		{
			dot: "bg-[#a551ff]",
			borderColor: "border-[#a551ff60]",
			bg: "bg-zinc-300 dark:bg-zinc-900 dark:bg-[radial-gradient(ellipse_at_bottom_left,rgba(165,81,255,0.1)_0%,transparent_65%)] bg-[radial-gradient(ellipse_at_bottom_left,rgba(165,81,255,0.35)_0%,transparent_65%)]",
			title: "Control de Extintores",
			desc: "Seguimiento de carga, vencimientos y pruebas hidráulicas según Dec. 351/79 Cap. 18.",
			t: "extintores",
			actual: "false",
		},
		{
			dot: "bg-[#ff6b9d]",
			borderColor: "border-[#ff6b9d60]",
			bg: "bg-zinc-300 dark:bg-zinc-900 dark:bg-[radial-gradient(ellipse_at_bottom_left,rgba(255,107,157,0.1)_0%,transparent_65%)] bg-[radial-gradient(ellipse_at_bottom_left,rgba(255,107,157,0.35)_0%,transparent_65%)]",
			title: "Medición de Vibraciones",
			desc: "Evaluación de cuerpo entero y mano-brazo según Res. SRT 295/03 e ISO 2631/5349.",
			t: "vibraciones",
			actual: "false",
		},
		{
			dot: "bg-[#ffd700]",
			borderColor: "border-[#ffd70060]",
			bg: "bg-zinc-300 dark:bg-zinc-900 dark:bg-[radial-gradient(ellipse_at_bottom_left,rgba(255,215,0,0.1)_0%,transparent_65%)] bg-[radial-gradient(ellipse_at_bottom_left,rgba(255,215,0,0.35)_0%,transparent_65%)]",
			title: "Capacitaciones HSE",
			desc: "Matriz esencial de 20 capacitaciones obligatorias según Dec. 351/79 Cap. 21.",
			t: "capacitaciones",
			actual: "false",
		},
		{
			dot: "bg-[#00bcd4]",
			borderColor: "border-[#00bcd460]",
			bg: "bg-zinc-300 dark:bg-zinc-900 dark:bg-[radial-gradient(ellipse_at_bottom_left,rgba(0,188,212,0.1)_0%,transparent_65%)] bg-[radial-gradient(ellipse_at_bottom_left,rgba(0,188,212,0.35)_0%,transparent_65%)]",
			title: "Control de EPP y EPIS",
			desc: "Gestión de entrega, certificación IRAM y registro según Res. SRT 299/11.",
			t: "epp",
			actual: "false",
		},
		{
			dot: "bg-[#ff5722]",
			borderColor: "border-[#ff572260]",
			bg: "bg-zinc-300 dark:bg-zinc-900 dark:bg-[radial-gradient(ellipse_at_bottom_left,rgba(255,87,34,0.1)_0%,transparent_65%)] bg-[radial-gradient(ellipse_at_bottom_left,rgba(255,87,34,0.35)_0%,transparent_65%)]",
			title: "Informe Antisiniestral",
			desc: "Cálculo de carga de fuego, medios de escape y habilitación de bomberos.",
			t: "antisiniestral",
			actual: "false",
		},
		{
			dot: "bg-[#8bc34a]",
			borderColor: "border-[#8bc34a60]",
			bg: "bg-zinc-300 dark:bg-zinc-900 dark:bg-[radial-gradient(ellipse_at_bottom_left,rgba(139,195,74,0.1)_0%,transparent_65%)] bg-[radial-gradient(ellipse_at_bottom_left,rgba(139,195,74,0.35)_0%,transparent_65%)]",
			title: "Chequeo de Equipos y Vehículos",
			desc: "Checklists operativos para autoelevadores, maquinaria vial y vehículos (Res. 960/15).",
			t: "vehiculos",
			actual: "false",
		},
	]
	return (
		<section id="modulos" className="py-50 px-5">
			<div className="w-full sm:max-w-5xl 2xl:max-w-7xl sm:mx-auto px-0 sm:px-4">
				<h2 className="text-2xl md:text-4xl text-pretty  text-center mb-2.5 font-semibold">
					Protocolos Soportados
				</h2>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-10">
					{items.map(item => (
						<Link
							to={`/teoria`}
							search={{
								t: item.t as
									| "iluminacion"
									| "ruido"
									| "pat"
									| "extintores"
									| "vibraciones"
									| "capacitaciones"
									| "epp"
									| "antisiniestral"
									| "vehiculos",
								from: "landing",
							}}
							key={item.title}
							className={`rounded-lg p-5 flex gap-4 items-start border ${item.borderColor} ${item.bg} relative`}
						>
							<span
								className={`text-xs absolute top-0 -right-4 rounded-lg  p-2 px-4 tracking-wide rotate-12 italic ${item.actual === "true" ? "bg-green-800" : "bg-gray-800"}`}
							>
								{item.actual === "true" ? "nuevo" : "proximamente"}
							</span>
							<div>
								<h4 className="text-lg mb-1">{item.title}</h4>
								<p className="text-foreground-soft text-sm">{item.desc}</p>
							</div>
						</Link>
					))}
				</div>
			</div>
		</section>
	)
}
