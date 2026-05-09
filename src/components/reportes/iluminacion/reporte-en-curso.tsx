import { Button } from "#/components/ui/button"
import { Loader, TriangleAlert } from "lucide-react"
import { useState } from "react"
import ReporteNuevoEdit from "./reporte-nuevo-edit"
import useScrollTop from "#/hooks/scroll-top"
import { useDeleteReporteNuevo } from "../../../../queries/reportes/iluminacion/use-delete-reporte-nuevo"
import type { ReporteIluminacionType } from "../../../../db/reportes/iluminacion/schema"
import { useForm } from "@tanstack/react-form"
import { reporteIluminacionIdValidator } from "../../../../db/reportes/iluminacion/reporte-validator"

export default function ReporteEnCurso({
	reporteNuevo,
}: {
	reporteNuevo: ReporteIluminacionType
}) {
	useScrollTop()
	const [newReportWarning, setNewReportWarning] = useState(true)

	if (newReportWarning) {
		return (
			<article className="flex flex-col gap-10 items-center justify-center">
				<div className="flex flex-col justify-center items-center gap-3">
					<TriangleAlert className="size-16 text-amber-500/50" />
					<span className="tracking-wider text-lg">Atención</span>
				</div>
				<span className="tracking-widest text-center text-pretty w-5/6 mx-auto italic text-foreground/50">
					¿Existe un reporte en curso, desea continuarlo o crear uno nuevo?
				</span>

				<span className="text-sm tracking-widest text-center text-pretty w-5/6 mx-auto italic text-amber-500/50">
					No se podrá recuperar la información una vez eliminada.
				</span>

				<div className="flex flex-col gap-4 w-5/6 mx-auto">
					<Button
						variant="outline"
						className="py-6 w-full"
						onClick={() => {
							setNewReportWarning(false)
							window.scroll({ top: 0 })
						}}
					>
						Continuar Reporte
					</Button>
					<BorrarReporteEnCurso reporteNuevo={reporteNuevo} />
				</div>
			</article>
		)
	}

	return <ReporteNuevoEdit reporteNuevo={reporteNuevo} />
}

function BorrarReporteEnCurso({
	reporteNuevo,
}: {
	reporteNuevo: ReporteIluminacionType
}) {
	const {
		mutateAsync: deleteReporteNuevoMutation,
		error,
		isPending,
	} = useDeleteReporteNuevo(reporteNuevo.id)

	const form = useForm({
		defaultValues: {
			id: reporteNuevo.id,
		},
		validators: {
			onSubmit: reporteIluminacionIdValidator,
		},
		onSubmit: async ({ value }) => {
			const result = await deleteReporteNuevoMutation({
				data: { id: value.id },
			})

			if (!result) {
				console.error("Error al eliminar el nuevo reporte", error)
			}

			console.log("Nuevo reporte eliminado exitosamente")
		},
	})

	return (
		<form
			id="create-form"
			className="flex flex-col items-center justify-center gap-6"
			onSubmit={e => {
				e.preventDefault()
				form.handleSubmit()
			}}
		>
			<div className="flex justify-center items-center gap-2 w-full">
				<Button
					variant="secondary"
					type="submit"
					disabled={isPending}
					className="flex-1 py-6"
				>
					{isPending ? (
						<div className="flex gap-2 items-center justify-center">
							Eliminando... <Loader className="animate-spin size-4"></Loader>
						</div>
					) : (
						"Crear Nuevo"
					)}
				</Button>
			</div>
			{error && (
				<p className="text-red-500 text-xs">
					Error al eliminar el nuevo reporte
				</p>
			)}
		</form>
	)
}
