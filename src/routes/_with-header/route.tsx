import { createFileRoute, Link, Outlet } from "@tanstack/react-router"
import { Menu, X } from "lucide-react"
import { useState } from "react"

export const Route = createFileRoute("/_with-header")({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<div className="w-screen sm:max-w-5xl 2xl:max-w-7xl sm:mx-auto min-h-svh flex flex-col">
			<Navbar />
			<main className="w-full flex-1 flex flex-col bw">
				<Outlet />
			</main>
		</div>
	)
}

function Navbar() {
	const [isOpen, setIsOpen] = useState(false)

	return (
		<header className="w-full flex justify-between items-center p-4 bw">
			<Link to="/landing" className="">
				<div className="flex items-center gap-3">
					<img
						src="/EnHySa_logo.webp"
						alt="logo EnHySa"
						className="size-10 object-cover"
					/>

					<p className="text-2xl">EnHySa App</p>
				</div>
			</Link>
			<nav className="flex items-center gap-6 max-md:hidden">
				<Link
					to="/landing"
					hash=""
					className="text-white no-underline text-sm transition-colors hover:text-[#e2711d]"
				>
					¿Qué es EnHySa App?
				</Link>
				<Link
					to="/landing"
					hash="caracteristicas"
					className="text-white no-underline text-sm transition-colors hover:text-[#e2711d]"
				>
					Características
				</Link>
				<Link
					to="/landing"
					hash="modulos"
					className="text-white no-underline text-sm transition-colors hover:text-[#e2711d]"
				>
					Módulos
				</Link>
				<Link
					to="/login"
					className="bg-[#5cb85c] text-white rounded-md px-5 py-2 text-sm font-semibold no-underline transition-all hover:bg-[#4ca84c] hover:shadow-[0_4px_12px_rgba(92,184,92,0.3)]"
				>
					Ingresar
				</Link>
			</nav>
			<button
				onClick={() => setIsOpen(true)}
				className="md:hidden text-white"
				aria-label="Abrir menú"
			>
				<Menu size={28} />
			</button>

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
			} bw`}
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
				hash=""
				className="text-2xl font-semibold no-underline text-white transition-colors hover:text-[#e2711d]"
			>
				¿Qué es EnHySa App?
			</Link>
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
				to="/login"
				onClick={close}
				className="bg-[#5cb85c] text-white rounded-md px-8 py-3 text-lg font-semibold no-underline transition-all hover:bg-[#4ca84c]"
			>
				Probar Gratis
			</Link>
		</div>
	)
}
