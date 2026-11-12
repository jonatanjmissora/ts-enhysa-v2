import { createFileRoute } from "@tanstack/react-router"
import Hero from "#/components/landing/Hero"
import Features from "#/components/landing/Features"
import Modules from "#/components/landing/Modules"
import Plans from "#/components/landing/Plans"

export const Route = createFileRoute("/_with-header/landing")({
	component: Landing,
})

function Landing() {
	return (
		<div className="font-sans antialiased">
			<Hero />
			<Features />
			<Modules />
			<Plans />
			<footer className="py-8 px-5 border-t border-[#2c2c2c] text-center text-sm text-foreground-soft">
				<div className="w-full sm:max-w-5xl 2xl:max-w-7xl sm:mx-auto">
					&copy; 2026 EnHySa Consultora. Todos los derechos reservados.
					Desarrollado conforme a normativas de la Superintendencia de Riesgos
					del Trabajo (SRT).
				</div>
			</footer>
		</div>
	)
}
