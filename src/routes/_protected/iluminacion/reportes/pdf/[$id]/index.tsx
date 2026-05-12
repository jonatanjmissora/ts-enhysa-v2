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
		<div className="min-h-svh w-full relative flex flex-col items-center gap-10">
			<BackChevron to="/iluminacion/reportes" />
			<Title text="Reporte Iluminación PDF" className="mt-15" />
			<span className="text-sm italic text-center w-5/6 mx-auto text-muted-foreground">
				Aqui se mostrara el hermoso pdf que generara tu informe
			</span>
		</div>
	)
}
