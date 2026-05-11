import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute(
	"/_protected/iluminacion/nuevo-informe/opinon/"
)({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<article className="w-full min-h-svh flex flex-col items-center gap-0 relative mb-60">
			OPINION
		</article>
	)
}
