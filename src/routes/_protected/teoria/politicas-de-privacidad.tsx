import { createFileRoute, Link } from "@tanstack/react-router"
import { ChevronLeft } from "lucide-react"

export const Route = createFileRoute(
	"/_protected/teoria/politicas-de-privacidad"
)({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<article className="w-full sm:max-w-5xl mx-auto py-20 px-4 space-y-8">
			<header className="space-y-4">
				<Link
					to="/suscripcion"
					className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
				>
					<ChevronLeft className="size-4" />
					Volver
				</Link>
				<h1 className="text-3xl font-bold tracking-tight">
					Políticas de Privacidad
				</h1>
				<p className="text-sm text-muted-foreground">
					Última actualización: junio 2026
				</p>
			</header>

			<section className="space-y-4 text-sm leading-relaxed text-muted-foreground">
				<p>
					En <strong>EnHySa</strong> nos comprometemos a proteger la privacidad
					de los datos personales de nuestros usuarios. Esta política describe
					cómo recopilamos, usamos, almacenamos y protegemos la información
					dentro de nuestra plataforma SaaS de seguridad e higiene laboral.
				</p>

				<h2 className="text-lg font-semibold text-foreground">
					1. Información que recopilamos
				</h2>
				<p>
					Recopilamos los datos necesarios para la prestación del servicio:
					nombre, correo electrónico, empresa, y datos técnicos asociados a los
					informes de seguridad e higiene (mediciones de iluminación, ruido,
					extintores, PAT, etc.). Estos datos son ingresados por el usuario o
					cargados a través de la plataforma.
				</p>

				<h2 className="text-lg font-semibold text-foreground">
					2. Uso de la información
				</h2>
				<p>
					Los datos recopilados se utilizan exclusivamente para: (a) proveer y
					mejorar los servicios de la plataforma, (b) generar informes técnicos
					solicitados por el usuario, (c) gestionar la suscripción y facturación
					de los planes contratados, y (d) comunicaciones operativas
					relacionadas con el servicio.
				</p>

				<h2 className="text-lg font-semibold text-foreground">
					3. Almacenamiento y seguridad
				</h2>
				<p>
					Los datos se almacenan en servidores seguros con cifrado en tránsito
					(TLS) y en reposo. Implementamos medidas técnicas y organizativas para
					proteger la información contra accesos no autorizados, pérdidas o usos
					indebidos.
				</p>

				<h2 className="text-lg font-semibold text-foreground">
					4. Compartición de datos
				</h2>
				<p>
					No compartimos datos personales con terceros, excepto cuando sea
					necesario para cumplir con obligaciones legales o con proveedores de
					infraestructura (hosting, base de datos) que actúan como encargados
					del tratamiento bajo estrictas cláusulas de confidencialidad.
				</p>

				<h2 className="text-lg font-semibold text-foreground">
					5. Conservación de datos
				</h2>
				<p>
					Conservamos los datos mientras la cuenta del usuario esté activa. Al
					cancelar la suscripción, el usuario puede solicitar la exportación o
					eliminación de sus datos. Pasado un plazo de 90 días desde la
					cancelación, los datos se eliminan de forma irreversible.
				</p>

				<h2 className="text-lg font-semibold text-foreground">
					6. Derechos del usuario
				</h2>
				<p>
					El usuario tiene derecho a acceder, rectificar, suprimir y portar sus
					datos personales. Puede ejercer estos derechos contactando a nuestro
					equipo de soporte a través de la plataforma.
				</p>

				<h2 className="text-lg font-semibold text-foreground">
					7. Cambios a esta política
				</h2>
				<p>
					Nos reservamos el derecho de actualizar esta política en cualquier
					momento. Los cambios serán notificados a través de la plataforma o por
					correo electrónico. El uso continuado del servicio implica la
					aceptación de la versión vigente.
				</p>

				<h2 className="text-lg font-semibold text-foreground">8. Contacto</h2>
				<p>
					Ante cualquier consulta sobre esta política, puede comunicarse a
					través de los canales de soporte disponibles en la aplicación.
				</p>
			</section>
		</article>
	)
}
