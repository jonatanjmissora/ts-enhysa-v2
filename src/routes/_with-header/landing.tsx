import { createFileRoute, Link, useNavigate } from "@tanstack/react-router"
import { useState, useEffect } from "react"
import SuscriptionPlans from "#/components/suscripciones"
import { authClient } from "#/lib/auth-client"

export const Route = createFileRoute("/_with-header/landing")({
	component: Landing,
})

function Landing() {
	return (
		<div className="text-white font-sans antialiased">
			<Hero />
			<Features />
			<Modules />
			<CtaSection />
			<Footer />
		</div>
	)
}

function Hero() {
	const { data: session } = authClient.useSession()
	const navigate = useNavigate()

	const scrollToHash = (hash: string) => () => {
		navigate({ to: "/landing", hash })
		requestAnimationFrame(() => {
			document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" })
		})
	}

	return (
		<section className="pt-20 pb-50 sm:py-10 2xl:py-50">
			<div className="w-full sm:max-w-5xl 2xl:max-w-7xl sm:mx-auto grid grid-cols-1 md:grid-cols-[1.2fr_0.8fr] gap-32 md:gap-12 items-center justify-center max-md:text-center px-0 sm:px-4">
				<div className="flex flex-col items-center justify-center gap-8">
					<span className="inline-block text-[#e2711d] px-3.5 py-1.5 rounded-full text-sm font-semibold mb-5 border border-[rgba(226,113,29,0.2)]">
						Resolución 84/12 & 85/12 SRT Automáticas
					</span>
					<h1 className="text-2xl md:text-5xl text-pretty leading-tight font-bold mb-5 text-center">
						Digitalizá tus Auditorías de{" "}
						<span className="text-[#e2711d]">Seguridad e Higiene</span>
					</h1>
					<p className="text-[#aaaaaa] mb-8 px-4 sm:px-0 max-w-150 max-md:mx-auto">
						La plataforma técnica definitiva para profesionales en Argentina.
						Automatizá el cálculo del Índice de Local (K), gestioná tus
						mediciones con luxómetros y generá protocolos listos para firmar en
						minutos.
					</p>
					<div className="flex gap-12 flex-wrap max-md:justify-center">
						<button
							type="button"
							onClick={() => navigate({ to: "/" })}
							className="bg-[#5cb85c] text-white rounded-md px-7 py-3.5 text-base font-semibold transition-all hover:bg-[#4ca84c] hover:shadow-[0_4px_12px_rgba(92,184,92,0.3)]"
						>
							{session?.user
								? "Continuar con la App"
								: "Comenzar a Probar la App"}
						</button>
						<button
							type="button"
							onClick={scrollToHash("modulos")}
							className="bg-[#1a1a1a] text-white rounded-md px-7 py-3.5 text-base font-semibold border border-[#333] transition-all hover:bg-[#222]"
						>
							Ver Módulos Técnicos
						</button>
					</div>
				</div>
				<PhoneMockup />
			</div>
		</section>
	)
}

function PhoneMockup() {
	const images = [
		"/animation1.webp",
		"/animation2.webp",
		"/animation3.webp",
		"/animation4.webp",
	]
	const [current, setCurrent] = useState(0)

	useEffect(() => {
		const timer = setInterval(() => {
			setCurrent(prev => (prev + 1) % images.length)
		}, 3000)
		return () => clearInterval(timer)
	}, [images.length])

	return (
		<div className="relative w-full max-w-[320px] mx-auto aspect-9/16">
			{images.map((src, i) => (
				<img
					key={src}
					src={src}
					alt={`Slide ${i + 1}`}
					className="absolute inset-0 w-full h-full object-contain transition-opacity duration-700"
					style={{ opacity: i === current ? 1 : 0 }}
				/>
			))}
		</div>
	)
}

function Features() {
	return (
		<section
			id="caracteristicas"
			className="py-50 px-5 border-t border-b border-[#2c2c2c]"
		>
			<div className="w-full sm:max-w-5xl 2xl:max-w-7xl sm:mx-auto px-0 sm:px-4">
				<h2 className="text-2xl md:text-4xl text-pretty  text-center mb-2.5 font-semibold">
					Diseñado por y para{" "}
					<span className="text-[#e2711d]">Licenciados en HSE</span>
				</h2>
				<p className="text-center text-[#aaaaaa] text-lg mb-12">
					Olvidate de las planillas de cálculo manuales y la transcripción de
					datos en la oficina.
				</p>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
					<div className="border rounded-xl p-8 border-[#e2711d70] bg-[radial-gradient(ellipse_at_bottom_left,rgba(226,113,29,0.05)_0%,transparent_70%)]">
						<div className="text-4xl mb-5 text-[#e2711d80]">📊</div>
						<h3 className="text-xl mb-3">Cálculos Automatizados</h3>
						<p className="text-[#aaaaaa] text-sm">
							Carga directa de luxes en campo, determinación automática del
							Índice de Local (K) y verificación inmediata contra los mínimos
							legales del Dec. 351/79.
						</p>
					</div>
					<div className="border rounded-xl p-8 border-[#5cb85c70] bg-[radial-gradient(ellipse_at_top_left,rgba(92,184,92,0.05)_0%,transparent_70%)]">
						<div className="text-4xl mb-5 text-[#5cb85c80]">🔒</div>
						<h3 className="text-xl mb-3">Matrícula y Firma Digital</h3>
						<p className="text-[#aaaaaa] text-sm">
							Integración directa de tu credencial del Colegio de Profesionales
							y firma digitalizada para emitir informes listos para auditorías
							de la SRT.
						</p>
					</div>
					<div className="border rounded-xl p-8 border-[#5197ff70] bg-[radial-gradient(ellipse_at_bottom_left,rgba(81,151,255,0.05)_0%,transparent_70%)]">
						<div className="text-4xl mb-5" style={{ color: "#5197ff80" }}>
							📱
						</div>
						<h3 className="text-xl mb-3">Uso Off-line en Planta</h3>
						<p className="text-[#aaaaaa] text-sm">
							Registrá mediciones en sótanos, naves industriales o zonas rurales
							sin señal. La aplicación sincroniza los datos al recuperar la
							conexión.
						</p>
					</div>
				</div>
			</div>
		</section>
	)
}

function Modules() {
	const items = [
		{
			dot: "bg-[#5cb85c70]",
			borderColor: "border-[#5cb85c70]",
			bg: "bg-[radial-gradient(ellipse_at_bottom_left,rgba(92,184,92,0.05)_0%,transparent_65%)]",
			title: "Estudio de Iluminación",
			desc: "Protocolo oficial según Res. 84/2012 SRT. Gestión de luminarias y fuentes mixtas.",
			t: "iluminacion",
		},
		{
			dot: "bg-[#e2711d70]",
			borderColor: "border-[#e2711d70]",
			bg: "bg-[radial-gradient(ellipse_at_bottom_left,rgba(226,113,29,0.05)_0%,transparent_65%)]",
			title: "Estudio de Ruido",
			desc: "Evaluación de puestos de trabajo conforme a la Res. 85/2012 SRT.",
			t: "ruido",
		},
		{
			dot: "bg-[#5197ff70]",
			borderColor: "border-[#5197ff70]",
			bg: "bg-[radial-gradient(ellipse_at_bottom_left,rgba(81,151,255,0.05)_0%,transparent_65%)]",
			title: "Puesta a Tierra (PAT)",
			desc: "Verificación de continuidad de masas y resistencia bajo la Res. 900/15 SRT.",
			t: "pat",
		},
		{
			dot: "bg-[#a551ff70]",
			borderColor: "border-[#a551ff70]",
			bg: "bg-[radial-gradient(ellipse_at_bottom_left,rgba(165,81,255,0.05)_0%,transparent_65%)]",
			title: "Control de Extintores",
			desc: "Seguimiento de carga, vencimientos y pruebas hidráulicas según Dec. 351/79 Cap. 18.",
			t: "extintores",
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
								t: item.t as "iluminacion" | "ruido" | "pat" | "extintores",
								from: "landing",
							}}
							key={item.title}
							className={`rounded-lg p-5 flex gap-4 items-start border ${item.borderColor} ${item.bg}`}
						>
							<div
								className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${item.dot}`}
							/>
							<div>
								<h4 className="text-lg mb-1">{item.title}</h4>
								<p className="text-[#aaaaaa] text-sm">{item.desc}</p>
							</div>
						</Link>
					))}
				</div>
			</div>
		</section>
	)
}

function CtaSection() {
	return (
		<section id="suscriptions" className="pt-10 pb-50 px-5 bg-linear-to-b">
			<div className="max-w-162.5 mx-auto text-center">
				<h2 className="text-2xl md:text-4xl text-pretty  mb-4 font-semibold">
					Jerarquiza tu servicio técnico hoy mismo
				</h2>
				<p className="text-[#aaaaaa] mb-10">
					Unite a los profesionales de Higiene y Seguridad que ya digitalizaron
					sus auditorías con EnHySa App.
				</p>
			</div>
			<div className="py-10 w-full sm:max-w-5xl 2xl:max-w-7xl sm:mx-auto flex flex-col justify-between items-center px-0 sm:px-4">
				<SuscriptionPlans from="landing" />
			</div>
		</section>
	)
}

function Footer() {
	return (
		<footer className="py-8 px-5 border-t border-[#2c2c2c] text-center text-sm text-[#aaaaaa]">
			<div className="w-full sm:max-w-5xl 2xl:max-w-7xl sm:mx-auto">
				&copy; 2026 EnHySa Consultora. Todos los derechos reservados.
				Desarrollado conforme a normativas de la Superintendencia de Riesgos del
				Trabajo (SRT).
			</div>
		</footer>
	)
}
