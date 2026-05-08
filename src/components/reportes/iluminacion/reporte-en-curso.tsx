import { Button } from "#/components/ui/button"
import { Link } from "@tanstack/react-router"
import { TriangleAlert } from "lucide-react"
import { useState } from "react"
import ReporteNuevoIluminacion from "./reporte-nuevo"
import ReporteNuevoEdit from "./reporte-nuevo-edit"

export default function ReporteEnCurso() {
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
						onClick={() => setNewReportWarning(false)}
					>
						Continuar Reporte
					</Button>
					TODO: Hacer un formulario para borrar el nuevo reporte en curso
					<Link to="/iluminacion/nuevo-informe/areas" className="w-full">
						<Button
							variant="secondary"
							className="py-6 w-full ring-[1px] ring-foreground/20"
						>
							Nuevo Reporte
						</Button>
					</Link>
				</div>
			</article>
		)
	}

	return <ReporteNuevoEdit />
}
