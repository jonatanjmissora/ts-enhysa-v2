import { useForm } from "@tanstack/react-form"
import type { ReporteIluminacionType } from "../../../../../db/reportes/iluminacion/schema"
import { useDeleteReporteNuevo } from "../../../../../queries/reportes/iluminacion/use-delete-reporte"
import { reporteIluminacionIdValidator } from "../../../../../db/reportes/iluminacion/reporte-validator"
import { Button } from "#/components/ui/button"
import { Loader } from "lucide-react"
import { useQueryClient } from "@tanstack/react-query"

export default function EliminarReporteNuevo({
	reporteNuevo,
	setNewReportWarning,
}: {
	reporteNuevo: ReporteIluminacionType
	setNewReportWarning: (value: boolean) => void
}) {
	const queryClient = useQueryClient()
	const {
		mutateAsync: deleteReporteNuevo,
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
			const result = await deleteReporteNuevo({
				data: { id: value.id },
			})

			if (!result) {
				console.error("Error al eliminar el nuevo reporte", error)
			}

			console.log("Nuevo reporte eliminado exitosamente")
			queryClient.setQueryData(["reporte-iluminacion-nuevo"], null)
			setNewReportWarning(false)
		},
	})

	return (
		<form
			id="create-form"
			className="flex flex-col items-center justify-center gap-6 flex-1"
			onSubmit={e => {
				e.preventDefault()
				form.handleSubmit()
			}}
		>
			<div className="flex justify-center items-center gap-2 w-full">
				<Button type="submit" disabled={isPending} className="flex-1 py-6">
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
