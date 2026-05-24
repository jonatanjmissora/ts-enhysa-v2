import Loading from "#/components/loading"
import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute, Link } from "@tanstack/react-router"
import { Suspense, useState } from "react"
import { reporteQueryOptions } from "../../../../../../queries/reportes/iluminacion/reportes-query"
import Title from "#/components/title"
import { Button } from "#/components/ui/button"
import type { ReporteIluminacionType } from "../../../../../../db/reportes/iluminacion/schema"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu"
import { Ellipsis } from "lucide-react"
import EditResumenAlert from "#/components/reportes/iluminacion/edit/edit-resumen"

export const Route = createFileRoute(
	"/_protected/iluminacion/reportes/$id/resumen"
)({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<Suspense
			fallback={
				<Loading
					text="obteniendo resumen"
					className="scale-50 justify-start  max-h-[50svh]"
				/>
			}
		>
			<Resumen />
		</Suspense>
	)
}

function Resumen() {
	const { id } = Route.useParams()
	const { data: reporte } = useSuspenseQuery(reporteQueryOptions({ id }))

	if (!reporte) {
		return (
			<span className="text-sm italic text-foreground/50 text-center">
				No se encontró ningún reporte
			</span>
		)
	}

	return (
		<article className="min-h-screen w-5/6 mx-auto flex flex-col gap-14 py-15 tracking-wider relative">
			<div className="absolute top-14 left-0">
				<ResumenDropdownMenu reporte={reporte} />
			</div>
			<div className="flex flex-col justify-center items-center gap-3">
				<Title text="Conclusiones Finales" />
				<span className="text-sm text-pretty italic">
					{reporte?.conclusion}
				</span>
			</div>

			<div className="flex flex-col justify-center items-center gap-3">
				<Title text="Observaciones Generales" />
				<span className="text-sm text-pretty italic">
					{reporte?.observacion}
				</span>
			</div>

			<div className="flex flex-col justify-center items-center gap-3">
				<Title text="Recomendaciones" />
				<span className="text-sm text-pretty italic">
					{reporte?.recomendacion}
				</span>
			</div>

			<Link
				to="/iluminacion/reportes/pdf/$id"
				params={{ id }}
				className="w-full flex justify-center"
			>
				<Button className="rounded-lg mt-20 py-5 w-5/6 sm:w-1/2 mx-auto">
					Generar el PDF
				</Button>
			</Link>
		</article>
	)
}

function ResumenDropdownMenu({ reporte }: { reporte: ReporteIluminacionType }) {
	const [isMenuOpen, setIsMenuOpen] = useState(false)
	return (
		<DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" className="cursor-pointer">
					<Ellipsis className="size-7 text-foreground/50" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="p-6" align="end">
				<DropdownMenuGroup className="flex flex-col bg-accent ring-[1px] ring-foreground/20 rounded-lg p-2">
					<EditResumenAlert reporte={reporte} setIsMenuOpen={setIsMenuOpen} />
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
