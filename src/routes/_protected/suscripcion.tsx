import SuscriptionPlans from "#/components/suscripciones"
import useScrollTop from "#/hooks/scroll-top"
import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { ChevronLeft, Shield } from "lucide-react"
import { Suspense } from "react"
import { z } from "zod"
import { userCreditsOptions } from "../../../queries/credits/user-credits-query"

const fromSearchSchema = z.object({
	from: z.string().optional(),
})

export const Route = createFileRoute("/_protected/suscripcion")({
	component: RouteComponent,
	validateSearch: fromSearchSchema,
})

function RouteComponent() {
	const { from } = Route.useSearch()
	useScrollTop()
	const navigate = useNavigate()
	return (
		<div className="min-h-svh flex flex-col relative mb-30">
			<button
				type="button"
				onClick={() => {
					if (from === "root") navigate({ to: "/" })
					else if (from === "landing")
						navigate({ to: "/landing", hash: "modulos" })
					else navigate({ to: `/${from}` as never })
				}}
				className="inline-flex items-center gap-1 text-sm text-foreground-soft hover:text-foreground transition-colors"
			>
				<ChevronLeft className="size-4" />
				Volver
			</button>

			<div className="flex-1 flex justify-center items-center flex-col gap-6 pt-20 sm:py-10 2xl:py-20">
				<div className="flex items-center gap-2 text-5xl 2xl:text-6xl font-bold tracking-wildest relative">
					<span>Suscripciones</span>
					<Shield className="absolute -top-20 right-0 size-30 2xl:size-50 -rotate-15 dark:text-amber-300/60 text-amber-800/80 -z-10" />
				</div>
				<div>
					<p className="mt-10 italic tracking-wider text-balance text-lg w-5/6 mx-auto text-center text-foreground-soft">
						La adquisición de créditos te permitirá obtener y descargar los informes realizados. Se necesitará de 1 crédito para desbloquear y descargar un informe.
					</p>
				</div>
				<Suspense fallback={<h1>Cargando...</h1>}>
					<Credits /> 
				</Suspense>
				<div className="w-11/12 sm:w-full">
					<SuscriptionPlans from={from} />
				</div>
			</div>
		</div>
	)
}

function Credits() {
	const { data: credits } = useSuspenseQuery(userCreditsOptions)
	return (
			<span className="font-semibold text-gray-50/50 sm:text-foreground-soft text-lg tracking-wider">
				creditos disponibles: {credits}
			</span>
	)
}