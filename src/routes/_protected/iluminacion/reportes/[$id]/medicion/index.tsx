import BackChevron from "#/components/back-chevron"
import Loading from "#/components/loading"
import Areas from "#/components/reportes/iluminacion/nuevo-informe/mediciones/areas"
import Localizadas from "#/components/reportes/iluminacion/nuevo-informe/mediciones/localizadas"
import Title from "#/components/title"
import { Button } from "#/components/ui/button"
import useScrollTop from "#/hooks/scroll-top"
import { createFileRoute, Link } from "@tanstack/react-router"
import { ChevronRight } from "lucide-react"
import { Suspense } from "react"

export const Route = createFileRoute(
	"/_protected/iluminacion/reportes/$id/medicion/"
)({
	component: RouteComponent,
})

function RouteComponent() {
	useScrollTop()
	return (
		<article className="w-full min-h-svh flex flex-col items-center gap-0 relative mb-60">
			<BackChevron to="/iluminacion/reportes" />
			<Title text="Nuevo Informe" className="mt-15" />
			<IluminacionAreas />
		</article>
	)
}

function IluminacionAreas() {
	const { id } = Route.useParams()
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

			<div className="flex flex-col justify-center items-center gap-4 w-5/6 sm:w-1/2 mt-30">
				<Link
					to="/iluminacion/reportes/$id/crud/create-resumen"
					params={{ id }}
					className="flex-1 w-full"
				>
					<Button type="submit" className="w-full py-6">
						Siguiente <ChevronRight className="size-6" />
					</Button>
				</Link>
			</div>
		</Suspense>
	)
}
