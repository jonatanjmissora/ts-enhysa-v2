import SuscriptionPlans from "../suscripciones"

export default function Plans() {
	return (
		<section id="suscriptions" className="pt-10 pb-50 px-5 bg-linear-to-b">
			<div className="max-w-162.5 mx-auto text-center">
				<h2 className="text-2xl md:text-4xl text-pretty  mb-4 font-semibold">
					Jerarquiza tu servicio técnico hoy mismo
				</h2>
				<p className="text-foreground-soft mb-10">
					Unite a los profesionales de Higiene y Seguridad que ya digitalizaron
					sus auditorías con EnHySa App.
				</p>
			</div>
			<div className="py-10 w-full sm:max-w-5xl 2xl:max-w-7xl sm:mx-auto flex flex-col justify-between items-center px-0 sm:px-4">
				<SuscriptionPlans from="landing" />
			</div>
		</section>
	)
}
