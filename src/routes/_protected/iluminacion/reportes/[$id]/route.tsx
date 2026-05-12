import BackChevron from "#/components/back-chevron"
import Title from "#/components/title"
import { createFileRoute, Link, Outlet } from "@tanstack/react-router"
import { File, RulerDimensionLine, UserRound } from "lucide-react"

export const Route = createFileRoute("/_protected/iluminacion/reportes/$id")({
	component: RouteComponent,
})

function RouteComponent() {
	const { id } = Route.useParams()
	return (
		<article className="w-full min-h-svh flex flex-col items-center gap-0 relative mb-60">
			<BackChevron to="/iluminacion/reportes" />
			<Title text="Reporte Iluminación" className="mt-15" />

			<nav className="flex items-center justify-between gap-2 w-11/12 mx-auto">
				<Link
					to="/iluminacion/reportes/$id/general"
					params={{ id }}
					activeProps={{
						className: "bg-secondary ring-[1px] ring-cyan-700/25 text-cyan-700",
					}}
					className="flex-1 h-20 flex flex-col gap-2 items-center justify-center text-sm rounded-lg bg-accent"
				>
					<File className="size-10" />
					General
				</Link>
				<Link
					to="/iluminacion/reportes/$id/areas"
					params={{ id }}
					activeProps={{
						className:
							"bg-secondary ring-[1px] ring-purple-700/25 text-purple-700",
					}}
					className="flex-1 h-20 flex flex-col gap-2 items-center justify-center text-sm rounded-lg bg-accent"
				>
					<RulerDimensionLine className="size-10" />
					Areas
				</Link>
				<Link
					to="/iluminacion/reportes/$id/resumen"
					params={{ id }}
					activeProps={{
						className:
							"bg-secondary ring-[1px] ring-amber-700/25 text-amber-700",
					}}
					className="flex-1 h-20 flex flex-col gap-2 items-center justify-center text-sm rounded-lg bg-accent"
				>
					<UserRound className="size-10" />
					Resumen
				</Link>
			</nav>
			<Outlet />
		</article>
	)
}
