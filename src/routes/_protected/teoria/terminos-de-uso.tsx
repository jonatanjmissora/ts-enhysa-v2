import { createFileRoute, Link } from "@tanstack/react-router"
import { ChevronLeft } from "lucide-react"

export const Route = createFileRoute("/_protected/teoria/terminos-de-uso")({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<article className="max-w-3xl mx-auto py-10 px-4 space-y-8">
			<header className="space-y-4">
				<Link
					to="/"
					className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
				>
					<ChevronLeft className="size-4" />
					Volver
				</Link>
				<h1 className="text-3xl font-bold tracking-tight">
					Términos de Uso
				</h1>
				<p className="text-sm text-muted-foreground">Última actualización: junio 2026</p>
			</header>

			<section className="space-y-4 text-sm leading-relaxed text-muted-foreground">
				<p>
					Bienvenido a <strong>EnHySa</strong>. Al acceder y utilizar esta
					plataforma SaaS de seguridad e higiene laboral, usted acepta los
					siguientes términos y condiciones. Si no está de acuerdo con alguno de
					ellos, no debe utilizar el servicio.
				</p>

				<h2 className="text-lg font-semibold text-foreground">
					1. Descripción del servicio
				</h2>
				<p>
					EnHySa es una plataforma web que permite a profesionales de seguridad
					e higiene crear, gestionar y almacenar informes técnicos de
					iluminación, ruido, extintores, PAT y continuidad de masas, conforme
					a las normativas vigentes. El usuario es responsable de la veracidad
					de los datos ingresados y del uso que dé a los informes generados.
				</p>

				<h2 className="text-lg font-semibold text-foreground">
					2. Suscripciones y planes
				</h2>
				<p>
					El servicio se ofrece mediante planes de suscripción mensual o anual.
					Cada plan otorga una cantidad determinada de informes, usuarios y
					funcionalidades según lo detallado en la sección de planes. El pago se
					procesa al inicio de cada período y no se realizan reembolsos
					parciales por períodos no utilizados.
				</p>

				<h2 className="text-lg font-semibold text-foreground">
					3. Responsabilidades del usuario
				</h2>
				<p>
					El usuario se compromete a: (a) proporcionar información veraz al
					registrarse, (b) mantener la confidencialidad de su cuenta y
					contraseña, (c) no utilizar la plataforma para fines ilegales o no
					autorizados, y (d) no reproducir, distribuir o modificar el software
					de la plataforma sin autorización expresa.
				</p>

				<h2 className="text-lg font-semibold text-foreground">
					4. Limitación de responsabilidad
				</h2>
				<p>
					EnHySa no se hace responsable por: daños directos o indirectos
					derivados del uso de la plataforma, decisiones basadas en los
					informes generados, ni por la interpretación legal o técnica de los
					datos ingresados por el usuario. Los informes son herramientas de
					asistencia técnica y no reemplazan la evaluación profesional in situ.
				</p>

				<h2 className="text-lg font-semibold text-foreground">
					5. Propiedad intelectual
				</h2>
				<p>
					El código, diseño, logotipos y contenido de la plataforma son
					propiedad de EnHySa. El usuario conserva la propiedad de los datos y
					documentos que cargue o genere dentro de la plataforma.
				</p>

				<h2 className="text-lg font-semibold text-foreground">
					6. Cancelación y suspensión
				</h2>
				<p>
					El usuario puede cancelar su suscripción en cualquier momento desde
					la configuración de su cuenta. EnHySa se reserva el derecho de
					suspender o cancelar cuentas que violen estos términos, sin derecho a
					reembolso.
				</p>

				<h2 className="text-lg font-semibold text-foreground">
					7. Modificaciones de los términos
				</h2>
				<p>
					Podemos modificar estos términos en cualquier momento. Los cambios
					serán notificados a través de la plataforma. El uso continuado del
					servicio después de la publicación de los cambios constituye la
					aceptación de los nuevos términos.
				</p>

				<h2 className="text-lg font-semibold text-foreground">
					8. Legislación aplicable
				</h2>
				<p>
					Estos términos se rigen por las leyes de la República Argentina. Ante
					cualquier controversia, las partes se someten a los tribunales
					competentes de la Ciudad Autónoma de Buenos Aires.
				</p>
			</section>
		</article>
	)
}
