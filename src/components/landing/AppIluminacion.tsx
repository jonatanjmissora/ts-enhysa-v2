export default function AppIluminacion() {
	return (
		<article className="">
			<CargarDatos />
			<ElegirInforme />
			<ObtenerPDF />
		</article>
	)
}

function CargarDatos() {
	return (
		<div className="flex flex-col md:flex-row gap-30">
			<div className="h-100 w-60 bg-gray-500 rounded-lg">Imagen</div>
		</div>
	)
}

function ElegirInforme() {
	return <div>Elegir Informe</div>
}

function ObtenerPDF() {
	return <div>Obtener PDF</div>
}
