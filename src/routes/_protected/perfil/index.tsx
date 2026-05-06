import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_protected/perfil/")({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<article className="flex flex-col w-full min-h-svh">
			Hello "/_protected/perfil/"!
		</article>
	)
}
