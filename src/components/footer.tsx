import { Link, useLocation } from "@tanstack/react-router"
// import { PreferencesMenu } from "../layout/preferences-menu"

export default function Footer() {
	const actualYear = new Date().getFullYear()
	const pathname = useLocation({
		select: location => location.pathname,
	})

	return (
		<article className="w-full p-6 flex flex-col justify-center gap-10 relative overflow-hidden text-shadow-lg/50 text-gray-50">
			<img
				src="/EnHySa_logo.webp"
				alt="logo EnHySa"
				className="absolute z-10 -top-20 -right-20 size-80 -rotate-15 opacity-20"
			/>
			<p className="textL">Mapa del sitio</p>
			<ul className="p-4 flex flex-col gap-4">
				<Link to="/">Inicio</Link>
				<Link to="/perfil/tecnicos" search={{ from: pathname.split("/")[1] }}>
					Mi Perfil
				</Link>
				<Link to="/suscripcion" search={{ from: pathname.split("/")[1] }}>
					Suscripción
				</Link>
			</ul>
			<p className="text-xs w-full text-center">
				© {actualYear} Enhysa. Todos los derechos reservados.
			</p>
			{/* <div className="absolute top-5 right-4 z-20">
				<PreferencesMenu />
			</div> */}
		</article>
	)
}
