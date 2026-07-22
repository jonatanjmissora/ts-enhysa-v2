import { Link } from "@tanstack/react-router"
import { Mail, Phone } from "lucide-react"
import { useState } from "react"
// import { PreferencesMenu } from "../layout/preferences-menu"

export default function Footer() {
	const actualYear = new Date().getFullYear()
	const [soporte, setSoporte] = useState(false)

	return (
		<article className="w-full p-6 flex flex-col justify-center overflow-hidden gap-10 relative  text-foreground text-shadow-none">
			<img
				src="/EnHySa_logo.webp"
				alt="logo EnHySa"
				className="absolute -bottom-20 -right-20 size-80 -rotate-15 dark:opacity-20 opacity-70 -z-10 object-cover"
			/>
			<p className="textL py-2 border-b border-foreground/20">Mapa del sitio</p>
			<ul className="p-4 flex flex-col gap-4">
				<li className="w-full">
					<Link to="/landing">¿Qué es EnHySa App?</Link>
				</li>
				<li>
					<Link to="/">Inicio</Link>
				</li>
				<li>
					<Link to="/perfil/tecnicos">Mi Perfil</Link>
				</li>
				<li>
					<Link to="/suscripcion">Suscripción</Link>
				</li>
				<li>
					<button onClick={() => setSoporte(s => !s)}>Soporte técnico</button>
				</li>
				{soporte && (
					<li className="w-full">
						<Contactos />
					</li>
				)}
			</ul>

			<p className="text-xs w-full text-center z-10">
				© {actualYear} Enhysa. Todos los derechos reservados.
			</p>
		</article>
	)
}

function Contactos() {
	return (
		<>
			{/* MOVIL */}
			<div className="sm:hidden flex gap-2 justify-between text-xs">
				<a
					href="mailto:jonatanjmissora@gmail.com"
					title="mail_de_desarrollador"
					target="_blank"
					rel="noopener noreferrer"
				>
					<div className="flex flex-col items-center justify-center gap-2">
						<Mail />
						<span className="">soporte</span>
					</div>
				</a>
				<a
					href="mailto:mandrake@gmail.com"
					title="mail_de_tecnico"
					target="_blank"
					rel="noopener noreferrer"
				>
					<div className="flex flex-col items-center justify-center gap-2">
						<Mail />
						<span className="">técnico</span>
					</div>
				</a>

				<a
					title="whatsapp"
					target="_blank"
					rel="noopener noreferrer"
					href="https://wa.me/+5492914319025"
				>
					<div className="flex flex-col items-center justify-center gap-2">
						<Phone />
						<span className="">soporte</span>
					</div>
				</a>

				<a
					title="whatsapp"
					target="_blank"
					rel="noopener noreferrer"
					href="https://wa.me/+5492914319025"
				>
					<div className="flex flex-col items-center justify-center gap-2">
						<Phone />
						<span className="">técnico</span>
					</div>
				</a>
			</div>

			{/* DESKTOP */}
			<div className="hidden sm:flex items-center justify-center gap-20">
				<a
					href="https://mail.google.com/mail/u/0/?fs=1&to=jonatanjmissora@gmail.com&su=&body=&bcc=&tf=cm"
					title="mail_de_la_empresa"
					target="_blank"
					rel="noopener noreferrer"
				>
					<div className="flex items-center justify-center gap-2">
						<Mail />
						<span className="">soporte</span>
					</div>
				</a>
				<a
					href="https://mail.google.com/mail/u/0/?fs=1&to=mandra@gmail.com&su=&body=&bcc=&tf=cm"
					title="mail_de_la_empresa"
					target="_blank"
					rel="noopener noreferrer"
				>
					<div className="flex items-center justify-center gap-2">
						<Mail />
						<span className="">técnico</span>
					</div>
				</a>
				<a
					title="whatsapp"
					target="_blank"
					rel="noopener noreferrer"
					href="https://wa.me/+5492914319025"
				>
					<div className="flex items-center justify-center gap-2">
						<Phone />
						<span className="">soporte</span>
					</div>
				</a>

				<a
					title="whatsapp"
					target="_blank"
					rel="noopener noreferrer"
					href="https://wa.me/+5492914319025"
				>
					<div className="flex items-center justify-center gap-2">
						<Phone />
						<span className="">técnico</span>
					</div>
				</a>
			</div>
		</>
	)
}
