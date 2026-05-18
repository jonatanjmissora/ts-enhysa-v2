import BackChevron from "#/components/back-chevron"
import { createFileRoute, Link, Outlet } from "@tanstack/react-router"
import { CalendarDays, File, RulerDimensionLine, UserRound } from "lucide-react"
import { reporteQueryOptions } from "../../../../../../queries/reportes/iluminacion/reportes-query"
import { areasQueryOptions } from "../../../../../../queries/reportes/iluminacion/areas/areas-query"
import { useSuspenseQuery } from "@tanstack/react-query"
import { Suspense } from "react"

export const Route = createFileRoute("/_protected/iluminacion/reportes/$id")({
	loader: ({ context, params }) => {
		context.queryClient.ensureQueryData(reporteQueryOptions({ id: params.id }))
		context.queryClient.ensureQueryData(
			areasQueryOptions({ reportId: params.id })
		)
		return null
	},
	component: RouteComponent,
})

function RouteComponent() {
	const { id } = Route.useParams()
	return (
		<article className="w-full min-h-svh flex flex-col items-center gap-0 relative mb-60">
			<BackChevron to="/iluminacion/reportes" />
			<div className="flex flex-col items-center justify-center gap-1 w-11/12 mx-auto mt-15 py-2 mb-3">
				<span className="text-lg text-center  tracking-widest font-semibold">
					Reporte Iluminación
				</span>
				<Suspense fallback={<span className="animate-pulse">. . .</span>}>
					<SuspenseTitle />
				</Suspense>
			</div>

			<nav className="flex items-center justify-between gap-2 w-11/12 mx-auto">
				<Link
					to="/iluminacion/reportes/$id/general"
					params={{ id }}
					activeProps={{
						className:
							"bg-accent ring-[1px] dark:ring-cyan-700/25 ring-cyan-700/75 text-cyan-700",
					}}
					className="flex-1 h-20 flex flex-col gap-2 items-center justify-center text-sm rounded-lg"
				>
					<File className="size-10" />
					General
				</Link>
				<Link
					to="/iluminacion/reportes/$id/areas"
					params={{ id }}
					activeProps={{
						className:
							"bg-accent ring-[1px] dark:ring-purple-700/25 ring-purple-700/75 text-purple-700",
					}}
					className="flex-1 h-20 flex flex-col gap-2 items-center justify-center text-sm rounded-lg"
				>
					<RulerDimensionLine className="size-10" />
					Areas
				</Link>
				<Link
					to="/iluminacion/reportes/$id/resumen"
					params={{ id }}
					activeProps={{
						className:
							"bg-accent ring-[1px] dark:ring-amber-700/25 ring-amber-700/75 text-amber-700",
					}}
					className="flex-1 h-20 flex flex-col gap-2 items-center justify-center text-sm rounded-lg"
				>
					<UserRound className="size-10" />
					Resumen
				</Link>
			</nav>
			<Outlet />
		</article>
	)
}

const SuspenseTitle = () => {
	const { id } = Route.useParams()
	const { data: reporte } = useSuspenseQuery(reporteQueryOptions({ id }))

	return (
		<div className="flex items-center gap-2">
			<span className="text-sm tracking-wider text-foreground/50">
				{reporte?.empresa.razonSocial.toUpperCase()} -{" "}
				{reporte?.finishedAt?.toLocaleDateString("it-IT")}
			</span>
			<CalendarDays className="size-3 text-foreground/50" />
		</div>
	)
}
