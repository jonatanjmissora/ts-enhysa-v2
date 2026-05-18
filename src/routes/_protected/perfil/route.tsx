import { createFileRoute, Link, Outlet } from "@tanstack/react-router"
import { empresasQueryOptions } from "../../../../queries/empresas/empresas-query"
import { instrumentosQueryOptions } from "../../../../queries/instrumentos/instrumentos-query"
import { tecnicoQueryOptions } from "../../../../queries/tecnico/tecnico-query"
import Title from "#/components/title"
import { Cpu, UserRound, Warehouse } from "lucide-react"
import BackChevron from "#/components/back-chevron"

export const Route = createFileRoute("/_protected/perfil")({
	loader: ({ context }) => {
		context.queryClient.ensureQueryData(tecnicoQueryOptions)
		context.queryClient.ensureQueryData(empresasQueryOptions)
		context.queryClient.ensureQueryData(instrumentosQueryOptions)
		return null
	},
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<article className="w-full relative pt-10">
			<BackChevron to="/iluminacion/" />

			<Title text="Mi Perfil" />

			<nav className="flex items-center justify-between gap-2 w-11/12 mx-auto">
				<Link
					to="/perfil/tecnicos"
					activeProps={{
						className:
							"bg-accent/50 ring-[1px] ring-foreground/25 text-cyan-700",
					}}
					className="flex-1 h-20 flex flex-col gap-2 items-center justify-center text-sm rounded-lg"
				>
					<UserRound className="size-10" />
					Técnico
				</Link>
				<Link
					to="/perfil/empresas"
					activeProps={{
						className:
							"bg-accent/50 ring-[1px] ring-foreground/25 text-purple-700",
					}}
					className="flex-1 h-20 flex flex-col gap-2 items-center justify-center text-sm rounded-lg"
				>
					<Warehouse className="size-10" />
					Empresas
				</Link>
				<Link
					to="/perfil/instrumentos"
					activeProps={{
						className:
							"bg-accent/50 ring-[1px] ring-foreground/25 text-amber-700",
					}}
					className="flex-1 h-20 flex flex-col gap-2 items-center justify-center text-sm rounded-lg"
				>
					<Cpu className="size-10" />
					Instrumentos
				</Link>
			</nav>
			<Outlet />
		</article>
	)
}
