import Loading from "#/components/loading"
import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute, Link } from "@tanstack/react-router"
import { Suspense, useState } from "react"
import { reporteQueryOptions } from "../../../../../../../queries/reportes/iluminacion/reportes-query"
import Title from "#/components/title"
import { Button } from "#/components/ui/button"
import type { ReporteIluminacionType } from "../../../../../../../db/reportes/iluminacion/schema"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu"
import { Ellipsis } from "lucide-react"
import EditResumenAlert from "#/components/reportes/iluminacion/edit/edit-resumen"
import { areasQueryOptions } from "../../../../../../../queries/reportes/iluminacion/areas/areas-query"
import {
	AlertDialogTrigger,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogTitle,
	AlertDialog,
} from "#/components/ui/alert-dialog"

export const Route = createFileRoute(
	"/_protected/iluminacion/reportes/$id/_menu/resumen"
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
	const { data: areas } = useSuspenseQuery(
		areasQueryOptions({ reportId: reporte?.id ?? "" })
	)
	const [isModal, setIsModal] = useState(false)
	const [reportError, setReportError] = useState("")

	if (!reporte) {
		return (
			<span className="text-sm italic text-foreground/50 text-center">
				No se encontró ningún reporte
			</span>
		)
	}

	if (isModal) {
		return (
			<CompletoOResumidoModal
				isModal={isModal}
				setIsModal={setIsModal}
				reportId={reporte.id}
			/>
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
			<div className="mt-20 flex flex-col items-center justify-center gap-3">
				<ReporteCompleto
					reporte={reporte}
					areasLength={areas.length}
					setReportError={setReportError}
					setIsModal={setIsModal}
				/>
				{reportError && (
					<span className="text-sm italic text-red-500 text-center">
						{reportError}
					</span>
				)}
			</div>
		</article>
	)
}

function ReporteCompleto({
	reporte,
	areasLength,
	setReportError,
	setIsModal,
}: {
	reporte: ReporteIluminacionType
	areasLength: number
	setReportError: (error: string) => void
	setIsModal: (isModal: boolean) => void
}) {
	// const navigate = useNavigate()
	const handleSubmmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		setReportError("")
		if (!reporte.id) return setReportError("No se encontró reporte")
		if (
			!reporte.tecnicoId ||
			!reporte.empresaId ||
			!reporte.instrumentoId ||
			!reporte.clima
		)
			return setReportError("No se encontró información del reporte")
		if (areasLength === 0)
			return setReportError("No se encontraron mediciones asociadas al reporte")
		if (!reporte.conclusion || !reporte.recomendacion || !reporte.observacion)
			return setReportError(
				"No se encontraron las recomendaciones finales del reporte"
			)
		// navigate({
		// 	to: "/iluminacion/reportes/pdf/$id",
		// 	params: { id: reporte.id },
		// })
		setIsModal(true)
	}
	return (
		<form onSubmit={handleSubmmit} className="w-full flex justify-center">
			<Button type="submit" className="rounded-lg py-5 w-5/6 sm:w-1/2 mx-auto">
				Generar el PDF
			</Button>
		</form>
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

function CompletoOResumidoModal({
	isModal,
	setIsModal,
	reportId,
}: {
	setIsModal: (isModal: boolean) => void
	isModal: boolean
	reportId: string
}) {
	return (
		<AlertDialog open={isModal} onOpenChange={setIsModal}>
			<AlertDialogTrigger
				asChild
				className="hover:bg-accent"
			></AlertDialogTrigger>
			<AlertDialogContent className="sm:px-20 py-15 sm:py-6 w-full h-screen sm:h-[95dvh] overflow-auto border-none rounded-none max-w-screen flex flex-col">
				<AlertDialogTitle>
					<Title text="Formato del PDF" />
				</AlertDialogTitle>
				<AlertDialogDescription asChild className="flex-1">
					<div className="w-full h-full flex flex-col gap-8">
						<Link
							to="/iluminacion/reportes/pdf/$id/reducida"
							params={{ id: reportId }}
							className="flex flex-col gap-2"
						>
							<span className="font-bold text-lg tracking-widest text-center">
								Reducida
							</span>
							<span className="text-center text-xs text-foreground/50 italic">
								Muestra sólo el punto de mayor interés por área.
							</span>
							<div className="h-40 w-full">
								<img
									src="/reducida.webp"
									alt="reducida"
									className="w-full h-full object-contain"
								/>
							</div>
						</Link>
						<Link
							to="/iluminacion/reportes/pdf/$id/completa"
							params={{ id: reportId }}
							className="flex flex-col gap-2"
						>
							<span className="font-bold text-lg tracking-widest text-center">
								Completa
							</span>
							<span className="text-center text-xs text-foreground/50 italic">
								Muestra todos los puntos de medicion por area.
							</span>
							<div className="h-44 w-full">
								<img
									src="/completa.webp"
									alt="completa"
									className="w-full h-full object-contain"
								/>
							</div>
						</Link>
					</div>
				</AlertDialogDescription>
			</AlertDialogContent>
		</AlertDialog>
	)
}
