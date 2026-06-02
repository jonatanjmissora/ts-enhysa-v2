import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute(
	"/_protected/iluminacion/reportes_CRUD/$id/nuevo/"
)({
	component: RouteComponent,
})

function RouteComponent() {
	const { id } = Route.useParams()
	return <div>ID : {id}</div>
}
