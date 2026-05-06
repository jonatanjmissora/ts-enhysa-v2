import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_protected/perfil/empresas/")({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<article className="flex flex-col w-full min-h-svh">
			<h1>Empresas</h1>
		</article>
	)
}
