import Loading from "#/components/loading"
import Areas from "#/components/reportes/iluminacion/nuevo-informe/mediciones/areas"
import Localizadas from "#/components/reportes/iluminacion/nuevo-informe/mediciones/localizadas"
import useScrollTop from "#/hooks/scroll-top"
import { createFileRoute } from "@tanstack/react-router"
import { Suspense } from "react"

export const Route = createFileRoute(
	"/_protected/iluminacion/reportes/$id/_menu/medicion2"
)({
	component: RouteComponent,
})

function RouteComponent() {
	const { id } = Route.useParams()
	useScrollTop()
	return (
		<Suspense
			fallback={
				<Loading
					text="obteniendo mediciones..."
					className="scale-50 justify-start  max-h-[50svh] "
				/>
			}
		>
			<Areas id={id} />
			<Localizadas id={id} />
		</Suspense>
	)
}
