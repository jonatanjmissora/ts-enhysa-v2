import { Link } from "@tanstack/react-router"
// import { PreferencesMenu } from "../layout/preferences-menu"

export default function Footer() {
	const actualYear = new Date().getFullYear()

	return (
		<article className="w-full p-6 flex flex-col justify-center overflow-hidden gap-10 relative  text-foreground text-shadow-none">
			<img
				src="/EnHySa_logo.webp"
				alt="logo EnHySa"
				className="absolute -bottom-20 -right-20 size-80 -rotate-15 dark:opacity-20 opacity-70 -z-10"
			/>
			<p className="textL py-2 border-b border-foreground/20">Mapa del sitio</p>
			<ul className="p-4 flex flex-col gap-4">
				<Link to="/">Inicio</Link>
				<Link to="/perfil/tecnicos">Mi Perfil</Link>
				<Link to="/suscripcion">Suscripción</Link>
			</ul>
			<p className="text-xs w-full text-center z-10">
				© {actualYear} Enhysa. Todos los derechos reservados.
			</p>
			{/* <div className="absolute top-5 right-4 z-20">
				<PreferencesMenu />
			</div> */}
		</article>
	)
}
