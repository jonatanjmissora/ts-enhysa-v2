import BackChevron from "#/components/back-chevron"
import SuscriptionPlans from "#/components/suscripciones"
import useScrollTop from "#/hooks/scroll-top"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { ChevronLeft, Shield } from "lucide-react"
import { z } from "zod"

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
				className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
			>
				<ChevronLeft className="size-4" />
				Volver
			</button>

			<div className="flex-1 flex justify-center items-center flex-col gap-6 pt-20 sm:py-10 2xl:py-20">
				<div className="flex items-center gap-2 text-5xl 2xl:text-6xl font-bold tracking-wildest relative">
					<span>Planes</span>
					<Shield className="absolute top-1/2 left-full -translate-1/2 size-30 2xl:size-50 -rotate-15 dark:text-amber-300/60 text-amber-800/80 -z-10" />
				</div>
				<div>
					<p className="italic tracking-wider font-semibold text-pretty text-sm w-5/6 mx-auto text-center text-foreground/50">
						Tu actual plan es el "Plan Profesional". ¿Deseas cambiar a plan
						Empresarial? Checkea los beneficios de subir de plan.
					</p>
				</div>
				<div className="w-11/12 sm:w-full">
					<SuscriptionPlans from={from} />
				</div>
			</div>
		</div>
	)
}
