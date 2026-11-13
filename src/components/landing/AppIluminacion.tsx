export default function AppIluminacion() {
	return (
		<article className="flex flex-col gap-50">
			<CargarDatos />
			<ElegirInforme />
			<ObtenerPDF />
		</article>
	)
}

function CargarDatos() {
	return (
		<div className="flex flex-col md:flex-row justify-between gap-30 w-full">
			<div className="h-100 flex-1 bg-gray-500 rounded-lg"></div>
			<div className="p-10 flex-col	flex items-center justify-center flex-1">
				<h3 className="text-xl md:text-2xl text-pretty  text-center mb-2.5 font-semibold">
					Carga tus datos
				</h3>
				<p className="text-foreground-soft tracking-wide text-pretty text-center">
					Completa los formularios del técnico, los instrumentos y las empresas
					una sola vez, y utilizalos para todos tus informes.
				</p>
			</div>
		</div>
	)
}

function ElegirInforme() {
	return (
		<div className="flex flex-col md:flex-row justify-between gap-30 w-full">
			<div className="p-10 flex-col	flex items-center justify-center flex-1">
				<h3 className="text-xl md:text-2xl text-pretty  text-center mb-2.5 font-semibold">
					Elegir Informe
				</h3>
				<p className="text-foreground-soft tracking-wide text-pretty text-center">
					Escoge entre una variedad amplia de informes y protocolos segun tu
					necesidad, consulta teoria y checklists.
				</p>
			</div>
			<div className="h-100 flex-1 bg-gray-500 rounded-lg"></div>
		</div>
	)
}

function ObtenerPDF() {
	return (
		<div className="flex flex-col md:flex-row justify-between gap-30 w-full">
			<div className="h-100 flex-1 bg-gray-500 rounded-lg"></div>
			<div className="p-10 flex-col	flex items-center justify-center flex-1">
				<h3 className="text-xl md:text-2xl text-pretty  text-center mb-2.5 font-semibold">
					Generar Informe
				</h3>
				<p className="text-foreground-soft tracking-wide text-pretty text-center">
					Obtén los informes en formato PDF listos para presentar, con cálculos
					y gráficos realizados automáticamente.
				</p>
			</div>
		</div>
	)
}
