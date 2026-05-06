import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_protected/perfil/instrumentos/")({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<article className="flex flex-col w-full min-h-svh">
			<h1>Instrumentos</h1>
		</article>
	)
}
