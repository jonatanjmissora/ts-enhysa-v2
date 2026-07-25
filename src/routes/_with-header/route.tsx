import { authClient } from "#/lib/auth-client"
import {
	createFileRoute,
	Link,
	Outlet,
	useNavigate,
} from "@tanstack/react-router"
import { Menu, X } from "lucide-react"
import { useState } from "react"

export const Route = createFileRoute("/_with-header")({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<div className="w-screen sm:max-w-5xl 2xl:max-w-7xl sm:mx-auto min-h-svh flex flex-col">
			<Navbar />
			<main className="w-full flex-1 flex flex-col">
				<Outlet />
			</main>
		</div>
	)
}

function Navbar() {
	const { data: session } = authClient.useSession()
	const [isOpen, setIsOpen] = useState(false)
	const navigate = useNavigate()

	const handleHashNav = (hash: string) => () => {
		if (hash) {
			navigate({ to: "/landing", hash })
			requestAnimationFrame(() => {
				document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" })
			})
		} else {
			navigate({ to: "/landing" })
			window.scrollTo({ top: 0, behavior: "smooth" })
		}
	}

	return (
		<header className="w-full flex justify-between items-center p-4">
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
				<button
					type="button"
					onClick={handleHashNav("")}
					className=" no-underline text-sm transition-colors hover:text-[#4ca84c]"
				>
					¿Qué es EnHySa App?
				</button>
				<button
					type="button"
					onClick={handleHashNav("caracteristicas")}
					className=" no-underline text-sm transition-colors hover:text-[#4ca84c]"
				>
					Características
				</button>
				<button
					type="button"
					onClick={handleHashNav("modulos")}
					className=" no-underline text-sm transition-colors hover:text-[#4ca84c]"
				>
					Módulos
				</button>
				<Link
					to={session?.user ? "/" : "/login"}
					className="bg-[#5cb85c]  rounded-md px-5 py-2 text-sm font-semibold no-underline transition-all hover:bg-[#4ca84c] hover:shadow-[0_4px_12px_rgba(92,184,92,0.3)]"
				>
					{session?.user ? "Ir a Mi App" : "Ingresar"}
				</Link>
			</nav>
			<button
				onClick={() => setIsOpen(true)}
				className="md:hidden "
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
	const navigate = useNavigate()

	const handleHashNav = (hash: string) => () => {
		close()
		if (hash) {
			navigate({ to: "/landing", hash })
			requestAnimationFrame(() => {
				document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" })
			})
		} else {
			navigate({ to: "/landing" })
			window.scrollTo({ top: 0, behavior: "smooth" })
		}
	}

	return (
		<div
			className={`fixed inset-0 z-50 bg-[#121212] flex flex-col items-center justify-center gap-10 transition-transform duration-400 ${
				isOpen ? "translate-y-0" : "-translate-y-full"
			}`}
		>
			<button
				onClick={close}
				className="absolute top-6 right-6 "
				aria-label="Cerrar menú"
			>
				<X size={28} />
			</button>
			<button
				type="button"
				onClick={handleHashNav("")}
				className="text-2xl font-semibold no-underline transition-colors hover:text-[#4ca84c]"
			>
				¿Qué es EnHySa App?
			</button>
			<button
				type="button"
				onClick={handleHashNav("caracteristicas")}
				className="text-2xl font-semibold no-underline transition-colors hover:text-[#4ca84c]"
			>
				Características
			</button>
			<button
				type="button"
				onClick={handleHashNav("modulos")}
				className="text-2xl font-semibold no-underline transition-colors hover:text-[#4ca84c]"
			>
				Módulos
			</button>
			<Link
				to="/"
				onClick={close}
				className="bg-[#5cb85c] rounded-md px-8 py-3 text-lg font-semibold no-underline transition-all hover:bg-[#4ca84c]"
			>
				Ingresar
			</Link>
		</div>
	)
}
