import { createFileRoute, Link } from "@tanstack/react-router"
import { useState, useEffect } from "react"

export const Route = createFileRoute("/landing")({ component: Landing })

function Landing() {
	return (
		<div className="bg-[#121212] text-white min-h-svh font-sans antialiased">
			<Navbar />
			<Hero />
			<Features />
			<Modules />
			<CtaSection />
			<Footer />
		</div>
	)
}

function Navbar() {
	return (
		<header className="sticky top-0 z-50 bg-[#1a1a1a] border-b border-[#2c2c2c] px-5">
			<div className="w-full sm:max-w-5xl 2xl:max-w-7xl sm:mx-auto flex justify-between items-center p-4">
				<div className="flex items-center gap-3">
					<img
						src="/EnHySa_logo.webp"
						alt="logo EnHySa"
						className="size-10 object-cover"
					/>

					<p className="text-2xl">EnHySa App</p>
				</div>
				<nav className="flex items-center gap-6 max-md:hidden">
					<a
						href="#caracteristicas"
						className="text-white no-underline text-sm transition-colors hover:text-[#e2711d]"
					>
						Características
					</a>
					<a
						href="#modulos"
						className="text-white no-underline text-sm transition-colors hover:text-[#e2711d]"
					>
						Módulos
					</a>
					<a
						href="#contacto"
						className="bg-[#5cb85c] text-white rounded-md px-5 py-2 text-sm font-semibold no-underline transition-all hover:bg-[#4ca84c] hover:shadow-[0_4px_12px_rgba(92,184,92,0.3)]"
					>
						Probar Gratis
					</a>
				</nav>
			</div>
		</header>
	)
}

function Hero() {
	return (
		<section className="pt-20 pb-50 sm:py-10 2xl:py-50 bg-[radial-gradient(circle_at_80%_20%,rgba(226,113,29,0.05)_0%,transparent_50%)]">
			<div className="w-full sm:max-w-5xl 2xl:max-w-7xl sm:mx-auto grid grid-cols-1 md:grid-cols-[1.2fr_0.8fr] gap-32 md:gap-12 items-center justify-center max-md:text-center px-0 sm:px-4">
				<div className="flex flex-col items-center justify-center gap-8">
					<span className="inline-block bg-[rgba(226,113,29,0.1)] text-[#e2711d] px-3.5 py-1.5 rounded-full text-sm font-semibold mb-5 border border-[rgba(226,113,29,0.2)]">
						Resolución 84/12 & 85/12 SRT Automáticas
					</span>
					<h1 className="text-2xl md:text-5xl text-pretty leading-tight font-bold mb-5 text-center">
						Digitalizá tus Auditorías de{" "}
						<span className="text-[#e2711d]">Seguridad e Higiene</span>
					</h1>
					<p className="text-[#aaaaaa] mb-8 px-4 sm:px-0 max-w-[600px] max-md:mx-auto">
						La plataforma técnica definitiva para profesionales en Argentina.
						Automatizá el cálculo del Índice de Local (K), gestioná tus
						mediciones con luxómetros y generá protocolos listos para firmar en
						minutos.
					</p>
					<div className="flex gap-8 flex-wrap max-md:justify-center">
						<a
							href="#contacto"
							className="bg-[#5cb85c] text-white rounded-md px-7 py-3.5 text-base font-semibold no-underline transition-all hover:bg-[#4ca84c] hover:shadow-[0_4px_12px_rgba(92,184,92,0.3)]"
						>
							Comenzar Período de Prueba
						</a>
						<a
							href="#modulos"
							className="bg-[#1a1a1a] text-white rounded-md px-7 py-3.5 text-base font-semibold no-underline border border-[#333] transition-all hover:bg-[#222]"
						>
							Ver Módulos Técnicos
						</a>
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
			className="py-50 px-5 bg-[#1a1a1a] border-t border-b border-[#2c2c2c]"
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
					<div className="bg-[#121212] border border-[#333] rounded-xl p-8 transition-transform hover:-translate-y-1 hover:border-[#e2711d]">
						<div className="text-4xl mb-5 text-[#e2711d]">📊</div>
						<h3 className="text-xl mb-3">Cálculos Automatizados</h3>
						<p className="text-[#aaaaaa] text-sm">
							Carga directa de luxes en campo, determinación automática del
							Índice de Local (K) y verificación inmediata contra los mínimos
							legales del Dec. 351/79.
						</p>
					</div>
					<div className="bg-[#121212] border border-[#333] rounded-xl p-8 transition-transform hover:-translate-y-1 hover:border-[#e2711d]">
						<div className="text-4xl mb-5 text-[#5cb85c]">🔒</div>
						<h3 className="text-xl mb-3">Matrícula y Firma Digital</h3>
						<p className="text-[#aaaaaa] text-sm">
							Integración directa de tu credencial del Colegio de Profesionales
							y firma digitalizada para emitir informes listos para auditorías
							de la SRT.
						</p>
					</div>
					<div className="bg-[#121212] border border-[#333] rounded-xl p-8 transition-transform hover:-translate-y-1 hover:border-[#e2711d]">
						<div className="text-4xl mb-5" style={{ color: "#5197ff" }}>
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
			dot: "bg-[#5cb85c]",
			title: "Estudio de Iluminación",
			desc: "Protocolo oficial según Res. 84/2012 SRT. Gestión de luminarias y fuentes mixtas.",
			t: "iluminacion",
		},
		{
			dot: "bg-[#e2711d]",
			title: "Estudio de Ruido",
			desc: "Evaluación de puestos de trabajo conforme a la Res. 85/2012 SRT.",
			t: "ruido",
		},
		{
			dot: "bg-[#5197ff]",
			title: "Puesta a Tierra (PAT)",
			desc: "Verificación de continuidad de masas y resistencia bajo la Res. 900/15 SRT.",
			t: "pat",
		},
		{
			dot: "bg-[#a551ff]",
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
							className="bg-[#1a1a1a] rounded-lg p-5 flex gap-4 items-start border-l-4 border-[#333] hover:border-l-[#5cb85c] transition-colors"
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
		<section
			id="contacto"
			className="py-50 px-5 bg-linear-to-b from-[#121212] to-[#17120e]"
		>
			<div className="max-w-[650px] mx-auto text-center">
				<h2 className="text-2xl md:text-4xl text-pretty  mb-4 font-semibold">
					Jerarquiza tu servicio técnico hoy mismo
				</h2>
				<p className="text-[#aaaaaa] mb-10">
					Unite a los profesionales de Higiene y Seguridad que ya digitalizaron
					sus auditorías con EnHySa App.
				</p>
				<form
					className="flex flex-col gap-4"
					onSubmit={e => {
						e.preventDefault()
						alert(
							"¡Gracias por tu interés! Nos comunicaremos a la brevedad para darte acceso de prueba."
						)
					}}
				>
					<input
						type="text"
						placeholder="Tu Nombre Completo"
						required
						className="bg-[#1e1e1e] border border-[#333] rounded-lg p-4 text-white text-base w-full outline-none focus:border-[#e2711d]"
					/>
					<input
						type="email"
						placeholder="Correo Electrónico Profesional"
						required
						className="bg-[#1e1e1e] border border-[#333] rounded-lg p-4 text-white text-base w-full outline-none focus:border-[#e2711d]"
					/>
					<input
						type="text"
						placeholder="Matrícula / Provincia (ej: LHS011021 PBA)"
						required
						className="bg-[#1e1e1e] border border-[#333] rounded-lg p-4 text-white text-base w-full outline-none focus:border-[#e2711d]"
					/>
					<button
						type="submit"
						className="bg-[#5cb85c] text-white rounded-md px-7 py-3.5 text-base font-semibold transition-all hover:bg-[#4ca84c] hover:shadow-[0_4px_12px_rgba(92,184,92,0.3)] cursor-pointer border-none"
					>
						Solicitar Acceso Beta
					</button>
				</form>
			</div>
		</section>
	)
}

function Footer() {
	return (
		<footer className="bg-[#1a1a1a] py-8 px-5 border-t border-[#2c2c2c] text-center text-sm text-[#aaaaaa]">
			<div className="w-full sm:max-w-5xl 2xl:max-w-7xl sm:mx-auto">
				&copy; 2026 EnHySa Consultora. Todos los derechos reservados.
				Desarrollado conforme a normativas de la Superintendencia de Riesgos del
				Trabajo (SRT).
			</div>
		</footer>
	)
}
