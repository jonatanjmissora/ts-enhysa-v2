import Instrumentos from "#/components/instrumentos/instrumentos"
import Loading from "#/components/loading"
import { createFileRoute } from "@tanstack/react-router"
import { Suspense } from "react"

export const Route = createFileRoute("/_protected/perfil/instrumentos/")({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<article className="flex flex-col items-start justify-start min-h-svh w-full">
			<Suspense
				fallback={
					<Loading className="scale-50 justify-start  max-h-[50svh] " />
				}
			>
				<Instrumentos />
			</Suspense>
		</article>
	)
}
