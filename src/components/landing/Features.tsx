import AppHerramientas from "./AppHerramientas"
import AppIluminacion from "./AppIluminacion"

export default function Features() {
	return (
		<section
			id="caracteristicas"
			className="py-50 px-5 border-t border-b border-[#2c2c2c] flex flex-col gap-30"
		>
			<div className="w-full sm:max-w-5xl 2xl:max-w-7xl sm:mx-auto px-0">
				<h2 className="text-2xl md:text-4xl text-pretty  text-center mb-2.5 font-semibold">
					Diseñado por y para{" "}
					<span className="text-[#e2711d]">Licenciados en HSE</span>
				</h2>
				<p className="text-center text-foreground-soft text-lg mb-12">
					Olvidate de las planillas de cálculo manuales y la transcripción de
					datos en la oficina.
				</p>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
					<div className="border rounded-xl p-8 border-[#e2711d70] bg-zinc-300 dark:bg-zinc-900 dark:bg-[radial-gradient(ellipse_at_bottom_left,rgba(226,113,29,0.2)_0%,transparent_70%)] bg-[radial-gradient(ellipse_at_bottom_left,rgba(226,113,29,0.35)_0%,transparent_70%)]">
						<div className="text-4xl mb-5 text-[#e2711d80]">📊</div>
						<h3 className="text-xl mb-3">Cálculos Automatizados</h3>
						<p className="text-foreground-soft text-sm">
							Carga directa de luxes en campo, determinación automática del
							Índice de Local (K) y verificación inmediata contra los mínimos
							legales del Dec. 351/79.
						</p>
					</div>
					<div className="border rounded-xl p-8 border-[#5cb85c70] bg-zinc-300 dark:bg-zinc-900 dark:bg-[radial-gradient(ellipse_at_top_left,rgba(92,184,92,0.2)_0%,transparent_70%)] bg-[radial-gradient(ellipse_at_top_left,rgba(92,184,92,0.35)_0%,transparent_70%)] ">
						<div className="text-4xl mb-5 text-[#5cb85c80]">🔒</div>
						<h3 className="text-xl mb-3">Matrícula y Firma Digital</h3>
						<p className="text-foreground-soft text-sm">
							Integración directa de tu credencial del Colegio de Profesionales
							y firma digitalizada para emitir informes listos para auditorías
							de la SRT.
						</p>
					</div>
					<div className="border rounded-xl p-8 border-[#5197ff70] bg-zinc-300 dark:bg-zinc-900 dark:bg-[radial-gradient(ellipse_at_bottom_left,rgba(81,151,255,0.2)_0%,transparent_70%)] bg-[radial-gradient(ellipse_at_bottom_left,rgba(81,151,255,0.35)_0%,transparent_70%)]">
						<div className="text-4xl mb-5" style={{ color: "#5197ff80" }}>
							📱
						</div>
						<h3 className="text-xl mb-3">Uso Off-line en Planta</h3>
						<p className="text-foreground-soft text-sm">
							Registrá mediciones en sótanos, naves industriales o zonas rurales
							sin señal. La aplicación sincroniza los datos al recuperar la
							conexión.
						</p>
					</div>
				</div>
			</div>
			<AppIluminacion />
			<AppHerramientas />
		</section>
	)
}
