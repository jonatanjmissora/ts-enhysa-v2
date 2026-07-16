import { PLANS } from "@/lib/constants"
import { createFileRoute, Link } from "@tanstack/react-router"
import { ArrowLeft, Menu, X } from "lucide-react"
import { useState } from "react"
import { z } from "zod"

const searchSchema = z.object({
	plan: z.string().optional(),
	from: z.string().optional(),
})

export const Route = createFileRoute("/checkout")({
	validateSearch: searchSchema,
	component: RouteComponent,
})

function RouteComponent() {
	const { plan, from } = Route.useSearch()
	const backTo = from === "landing" ? "/landing" : "/suscripcion"
	const found = PLANS.find(p => p.title.toLowerCase() === plan?.toLowerCase())

	return (
		<article className="min-h-svh font-sans antialiased">
			<Navbar />
			<div className="py-10 w-full sm:max-w-5xl 2xl:max-w-7xl sm:mx-auto flex flex-col gap-8 justify-center items-center px-0 sm:px-4">
				<Link
					to={backTo}
					className="self-start flex items-center gap-2 text-sm text-foreground/60 hover:text-foreground transition-colors"
				>
					<ArrowLeft size={16} />
					Volver
				</Link>
				{found ? (
					<div className="text-center space-y-4">
						<h1 className="text-3xl font-bold">Checkout</h1>
						<p>
							Estás a punto de adquirir el plan{" "}
							<strong className="text-[#e2711d]">{found.title}</strong>.
						</p>
						<p className="text-2xl font-semibold text-foreground/50">
							${found.price.toLocaleString("es-AR")}
						</p>
					</div>
				) : (
					<div className="text-center space-y-4">
						<h1 className="text-3xl font-bold">Plan no encontrado</h1>
						<p className="text-foreground/60">
							El plan <strong>{plan}</strong> no existe.
						</p>
						<Link
							to={backTo}
							className="text-[#e2711d] underline underline-offset-4 hover:text-[#d0610d] transition-colors"
						>
							Ver planes disponibles
						</Link>
					</div>
				)}
			</div>
		</article>
	)
}

function Navbar() {
	const [isOpen, setIsOpen] = useState(false)

	return (
		<header className="sticky top-0 z-50 bg-[#1a1a1a] border-b border-[#2c2c2c] px-5">
			<div className="w-full sm:max-w-5xl 2xl:max-w-7xl sm:mx-auto flex justify-between items-center px-0 py-4 sm:p-4">
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
				<button
					onClick={() => setIsOpen(true)}
					className="md:hidden text-white"
					aria-label="Abrir menú"
				>
					<Menu size={28} />
				</button>
			</div>
			<MobileMenu isOpen={isOpen} setIsOpen={setIsOpen} />
		</header>
	)
}

function MobileMenu({
	isOpen,
	setIsOpen,
}: {
	isOpen: boolean
	setIsOpen: (open: boolean) => void
}) {
	const close = () => setIsOpen(false)

	return (
		<div
			className={`fixed inset-0 z-50 bg-[#121212] flex flex-col items-center justify-center gap-10 transition-transform duration-400 ${
				isOpen ? "translate-y-0" : "-translate-y-full"
			}`}
		>
			<button
				onClick={close}
				className="absolute top-6 right-6 text-white"
				aria-label="Cerrar menú"
			>
				<X size={28} />
			</button>
			<Link
				to="/landing"
				hash="caracteristicas"
				onClick={close}
				className="text-2xl font-semibold no-underline text-white transition-colors hover:text-[#e2711d]"
			>
				Características
			</Link>
			<Link
				to="/landing"
				hash="modulos"
				onClick={close}
				className="text-2xl font-semibold no-underline text-white transition-colors hover:text-[#e2711d]"
			>
				Módulos
			</Link>
			<Link
				to="/landing"
				hash="contacto"
				onClick={close}
				className="bg-[#5cb85c] text-white rounded-md px-8 py-3 text-lg font-semibold no-underline transition-all hover:bg-[#4ca84c]"
			>
				Probar Gratis
			</Link>
		</div>
	)
}
