import BackChevron from "#/components/back-chevron"
import Title from "#/components/title"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute(
	"/_protected/iluminacion/reportes/pdf/$id/"
)({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<div className="min-h-svh w-full mx-auto relative">
			<BackChevron to="/iluminacion/reportes" />
			<Title text="Reporte Iluminación PDF" className="mt-15" />
			Aqui se mostrara el hermoso pdf que generara tu informe
		</div>
	)
}
