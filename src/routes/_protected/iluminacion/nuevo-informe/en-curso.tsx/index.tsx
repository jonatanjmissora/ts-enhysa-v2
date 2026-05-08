import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute(
	"/_protected/iluminacion/nuevo-informe/en-curso/tsx/"
)({
	component: RouteComponent,
})

function RouteComponent() {
	return <div>Hello "/_protected/iluminacion/nuevo-informe/en-curso/tsx/"!</div>
}
