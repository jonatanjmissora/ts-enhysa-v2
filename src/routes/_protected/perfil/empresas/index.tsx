import Empresas from "#/components/empresas/empesas"
import Loading from "#/components/loading"
import { createFileRoute } from "@tanstack/react-router"
import { Suspense } from "react"

export const Route = createFileRoute("/_protected/perfil/empresas/")({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<article className="flex flex-col items-center justify-start min-h-svh w-full">
			<Suspense
				fallback={
					<Loading
						text="cargando empresas..."
						className="scale-50 justify-start  max-h-[50svh] "
					/>
				}
			>
				<Empresas />
			</Suspense>
		</article>
	)
}
