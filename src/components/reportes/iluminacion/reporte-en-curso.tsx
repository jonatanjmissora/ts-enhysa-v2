import { Button } from "#/components/ui/button"
import { TriangleAlert } from "lucide-react"
import { useState } from "react"
import EditReporteNuevo from "./nuevo-informe/edit-reporte-nuevo"
import useScrollTop from "#/hooks/scroll-top"
import type { ReporteIluminacionType } from "../../../../db/reportes/iluminacion/schema"
import DeleteReporteNuevo from "./nuevo-informe/delete-reporte-nuevo"
import CreateReporteNuevo from "./nuevo-informe/create-reporte-nuevo"

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
					<TriangleAlert className="size-16 dark:text-amber-500 text-amber-700/70" />
					<span className="tracking-wider text-lg">Atención</span>
				</div>
				<span className="tracking-widest text-center text-pretty w-5/6 mx-auto italic text-foreground/50">
					¿Existe un reporte en curso, desea continuarlo o crear uno nuevo?
				</span>

				<span className="text-sm tracking-widest text-center text-pretty w-5/6 mx-auto italic text-amber-700/70 dark:text-amber-500/50">
					No se podrá recuperar la información una vez eliminada.
				</span>

				<div className="flex flex-col gap-4 sm:flex-row w-5/6 mx-auto">
					<Button
						variant="outline"
						className="py-6 w-full sm:flex-1"
						onClick={() => {
							setNewReportWarning(false)
							window.scroll({ top: 0 })
						}}
					>
						Continuar Reporte
					</Button>
					<DeleteReporteNuevo
						reporteNuevo={reporteNuevo}
						setNewReportWarning={setNewReportWarning}
					/>
				</div>
			</article>
		)
	}

	return (
		<>
			{reporteNuevo ? (
				<EditReporteNuevo reporteNuevo={reporteNuevo} />
			) : (
				<CreateReporteNuevo />
			)}
		</>
	)
}
