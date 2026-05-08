import Loading from "#/components/loading"
import Tecnico from "#/components/tecnicos/tecnico"
import { createFileRoute } from "@tanstack/react-router"
import { Suspense } from "react"

export const Route = createFileRoute("/_protected/perfil/tecnicos/")({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<article className="flex flex-col items-start justify-start min-h-svh w-full">
			<Suspense
				fallback={
					<Loading
						text="cargando técnico..."
						className="scale-50 justify-start  max-h-[50svh] "
					/>
				}
			>
				<Tecnico />
			</Suspense>
		</article>
	)
}
