import Loading from "#/components/loading"
import { Label } from "#/components/ui/label"
import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute, Link } from "@tanstack/react-router"
import { Suspense, useState } from "react"
import { reporteQueryOptions } from "../../../../../../../queries/reportes/iluminacion/reportes-query"
import Title from "#/components/title"
import type { ReporteIluminacionType } from "../../../../../../../db/reportes/iluminacion/schema"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu"
import { Button } from "#/components/ui/button"
import { Edit, Ellipsis } from "lucide-react"
import DeleteReporte from "#/components/reportes/iluminacion/delete-reporte"
import { empresasQueryOptions } from "../../../../../../../queries/empresas/empresas-query"
import { instrumentosQueryOptions } from "../../../../../../../queries/instrumentos/instrumentos-query"

export const Route = createFileRoute(
	"/_protected/iluminacion/reportes/$id/_menu/general"
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
	const { data: empresas } = useSuspenseQuery(empresasQueryOptions)
	const { data: instrumentos } = useSuspenseQuery(instrumentosQueryOptions)
	const empresa = empresas?.find(empresa => empresa.id === reporte?.empresaId)
	const instrumento = instrumentos?.find(
		instrumento => instrumento.id === reporte?.instrumentoId
	)

	if (!reporte || !empresa || !instrumento)
		return (
			<div className="italic text-foreground-soft tracking-wider text-sm p-10">
				No se encontro el reporte
			</div>
		)

	return (
		<article className="min-h-screen w-5/6 mx-auto flex flex-col gap-10 tracking-wider my-14 relative">
			<div className="absolute top-0 left-0">
				<ReporteDropdownMenu reporte={reporte} />
			</div>
			<div className="grid grid-cols-2 gap-2">
				<Title text="Empresa" className="col-span-2" />
				<Label className="text-right ml-auto font-semibold text-amber-700">
					Nombre :{" "}
				</Label>
				<span>{empresa.razonSocial.toUpperCase()}</span>
				<Label className="text-right ml-auto font-semibold text-amber-700">
					CUIT :{" "}
				</Label>
				<span>{empresa.cuit.toUpperCase()}</span>
				<Label className="text-right ml-auto font-semibold text-amber-700">
					Direccion :{" "}
				</Label>
				<span>{empresa.direccion.toUpperCase()}</span>
				<Label className="text-right ml-auto font-semibold text-amber-700">
					Localidad :{" "}
				</Label>
				<span>{empresa.localidad.toUpperCase()}</span>
				<Label className="text-right ml-auto font-semibold text-amber-700">
					Provincia :{" "}
				</Label>
				<span>{empresa.provincia.toUpperCase()}</span>
				<Label className="text-right ml-auto font-semibold text-amber-700">
					Horarios :{" "}
				</Label>
				<span>{empresa.horarios.toUpperCase()}</span>
				{empresa.logo && (
					<div className="col-span-2 mt-10">
						<div className="h-20 w-full flex items-center justify-center">
							<img
								src={empresa.logo}
								alt="logo"
								className="h-full w-full object-contain"
							/>
						</div>
					</div>
				)}
			</div>

			<div className="grid grid-cols-2 gap-2">
				<Title text="Instrumento" className="col-span-2" />
				<Label className="text-right ml-auto font-semibold text-amber-700">
					Nombre :{" "}
				</Label>
				<span>{instrumento.nombre.toUpperCase()}</span>
				<Label className="text-right ml-auto font-semibold text-amber-700">
					Marca :{" "}
				</Label>
				<span>{instrumento.marca.toUpperCase()}</span>
				<Label className="text-right ml-auto font-semibold text-amber-700">
					Modelo :{" "}
				</Label>
				<span>{instrumento.modelo.toUpperCase()}</span>
				<Label className="text-right ml-auto font-semibold text-amber-700">
					Serie :{" "}
				</Label>
				<span>{instrumento.serie.toUpperCase()}</span>
				<Label className="text-right ml-auto font-semibold text-amber-700">
					Calibración :{" "}
				</Label>
				<span>{instrumento.fechaCalibracion.toLocaleDateString("it-IT")}</span>
				{instrumento.imagenes[0] !== "" && (
					<div className="w-11/12 my-10 col-span-2">
						<div className="flex w-full grid-cols-4 gap-1 content-center">
							{instrumento.imagenes.map(url => {
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
				<Label className="text-right ml-auto font-semibold text-amber-700">
					Clima :{" "}
				</Label>
				<span>{reporte.clima[0].toUpperCase()}</span>
				<Label className="text-right ml-auto font-semibold text-amber-700">
					Humedad :{" "}
				</Label>
				<span>{reporte.clima[1].toUpperCase()}%</span>
				<Label className="text-right ml-auto font-semibold text-amber-700">
					Temperatura :{" "}
				</Label>
				<span>{reporte.clima[2].toUpperCase()}°C</span>
				<Label className="text-right ml-auto font-semibold text-amber-700">
					Fecha :{" "}
				</Label>
				<span>
					{reporte.finishedAt
						? reporte.finishedAt.toLocaleDateString("it-IT")
						: "En curso"}
				</span>
				<Label className="text-right ml-auto font-semibold text-amber-700">
					Hora :{" "}
				</Label>
				<span>
					{reporte.finishedAt
						? reporte.finishedAt.toLocaleTimeString("it-IT")
						: "En curso"}
				</span>
			</div>
		</article>
	)
}

function ReporteDropdownMenu({ reporte }: { reporte: ReporteIluminacionType }) {
	const [isMenuOpen, setIsMenuOpen] = useState(false)
	return (
		<DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" className="cursor-pointer">
					<Ellipsis className="size-7 text-foreground-soft" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="p-6" align="end">
				<DropdownMenuGroup className="flex flex-col bg-accent ring-[1px] ring-foreground/20 rounded-lg p-2">
					{/* <EditReporteGeneral reporte={reporte} setIsMenuOpen={setIsMenuOpen} /> */}
					<Link
						to={"/iluminacion/reportes/$id/solo/edit-general"}
						params={{
							id: reporte.id,
						}}
						className="flex justify-center items-center gap-4 p-4 hover:bg-background rounded-lg"
					>
						<Edit className="size-3" />
						Editar
					</Link>
					<DropdownMenuSeparator className="bg-foreground/20 w-5/6 mx-auto" />
					<DeleteReporte reporte={reporte} setIsMenuOpen={setIsMenuOpen} />
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
