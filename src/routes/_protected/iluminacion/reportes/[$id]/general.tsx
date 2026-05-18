import Loading from "#/components/loading"
import { Label } from "#/components/ui/label"
import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { Suspense } from "react"
import { reporteQueryOptions } from "../../../../../../queries/reportes/iluminacion/reportes-query"
import Title from "#/components/title"

export const Route = createFileRoute(
	"/_protected/iluminacion/reportes/$id/general"
)({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<Suspense
			fallback={
				<Loading
					text="obteniendo reporte"
					className="scale-50 justify-start  max-h-[50svh]"
				/>
			}
		>
			<General />
		</Suspense>
	)
}

function General() {
	const { id } = Route.useParams()
	const { data: reporte } = useSuspenseQuery(reporteQueryOptions({ id }))

	if (!reporte) return <span>No existe reporte</span>

	return (
		<article className="min-h-screen w-5/6 mx-auto flex flex-col gap-10 tracking-wider my-14">
			<div className="grid grid-cols-2 gap-2">
				<Title text="Empresa" className="col-span-2" />
				<Label className="text-right ml-auto">Nombre : </Label>
				<span>{reporte?.empresa.razonSocial.toUpperCase()}</span>
				<Label className="text-right ml-auto">CUIT : </Label>
				<span>{reporte?.empresa.cuit.toUpperCase()}</span>
				<Label className="text-right ml-auto">Direccion : </Label>
				<span>{reporte?.empresa.direccion.toUpperCase()}</span>
				<Label className="text-right ml-auto">Localidad : </Label>
				<span>{reporte?.empresa.localidad.toUpperCase()}</span>
				<Label className="text-right ml-auto">Provincia : </Label>
				<span>{reporte?.empresa.provincia.toUpperCase()}</span>
				<Label className="text-right ml-auto">Horarios : </Label>
				<span>{reporte?.empresa.horarios.toUpperCase()}</span>
				{reporte.empresa.logo && (
					<div className="col-span-2">
						<div className="h-20 w-full flex items-center justify-center">
							<img
								src={reporte.empresa.logo}
								alt="logo"
								className="h-full w-full object-contain"
							/>
						</div>
					</div>
				)}
			</div>

			<div className="grid grid-cols-2 gap-2">
				<Title text="Instrumento" className="col-span-2" />
				<Label className="text-right ml-auto">Nombre : </Label>
				<span>{reporte?.instrumento.nombre.toUpperCase()}</span>
				<Label className="text-right ml-auto">Marca : </Label>
				<span>{reporte?.instrumento.marca.toUpperCase()}</span>
				<Label className="text-right ml-auto">Modelo : </Label>
				<span>{reporte?.instrumento.modelo.toUpperCase()}</span>
				<Label className="text-right ml-auto">Serie : </Label>
				<span>{reporte?.instrumento.serie.toUpperCase()}</span>
				<Label className="text-right ml-auto">Calibración : </Label>
				<span>
					{reporte?.instrumento.fechaCalibracion.toLocaleDateString("it-IT")}
				</span>
				{reporte?.instrumento.imagenes[0] !== "" && (
					<div className="w-11/12 my-10 col-span-2">
						<div className="flex w-full grid-cols-4 gap-1 content-center">
							{reporte?.instrumento.imagenes.map(url => {
								return (
									<div className="relative w-full h-20 " key={url}>
										<img
											src={url}
											alt=""
											className="h-full w-full object-contain rounded border border-foreground/10"
										/>
									</div>
								)
							})}
						</div>
					</div>
				)}
			</div>

			<div className="grid grid-cols-2 gap-2">
				<Title text="Condiciones" className="col-span-2" />
				<Label className="text-right ml-auto">Clima : </Label>
				<span>{reporte?.clima[0].toUpperCase()}</span>
				<Label className="text-right ml-auto">Humedad : </Label>
				<span>{reporte?.clima[1].toUpperCase()}%</span>
				<Label className="text-right ml-auto">Temperatura : </Label>
				<span>{reporte?.clima[2].toUpperCase()}°C</span>
				<Label className="text-right ml-auto">Fecha : </Label>
				<span>{reporte?.createdAt.toLocaleDateString("it-IT")}</span>
				<Label className="text-right ml-auto">Hora : </Label>
				<span>{reporte?.createdAt.toLocaleTimeString("it-IT")}</span>
			</div>
		</article>
	)
}
