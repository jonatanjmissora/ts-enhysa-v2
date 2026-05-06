import { createFileRoute, Link, Outlet } from "@tanstack/react-router"
import { empresasQueryOptions } from "../../../../queries/empresas/empresas-query"
import { instrumentosQueryOptions } from "../../../../queries/instrumentos/instrumentos-query"
import { tecnicoQueryOptions } from "../../../../queries/tecnico/tecnico-query"
import Title from "#/components/title"
import { Cpu, UserRound, Warehouse } from "lucide-react"

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
		<article className="w-full">
			<Title text="Mi Perfil" />

			<nav className="flex items-center justify-between gap-2 w-11/12 mx-auto">
				<Link
					to="/perfil/tecnicos"
					activeProps={{ className: "bg-secondary" }}
					className="flex-1 h-20 flex flex-col gap-2 items-center justify-center text-sm rounded-lg bg-accent ring ring-accent"
				>
					<UserRound className="size-10 text-foreground/70" />
					Técnico
				</Link>
				<Link
					to="/perfil/empresas"
					activeProps={{ className: "bg-secondary" }}
					className="flex-1 h-20 flex flex-col gap-2 items-center justify-center text-sm rounded-lg bg-accent"
				>
					<Warehouse className="size-10 text-foreground/70" />
					Empresas
				</Link>
				<Link
					to="/perfil/instrumentos"
					activeProps={{ className: "bg-secondary" }}
					className="flex-1 h-20 flex flex-col gap-2 items-center justify-center text-sm rounded-lg bg-accent"
				>
					<Cpu className="size-10 text-foreground/70" />
					Instrumentos
				</Link>
			</nav>
			<Outlet />
		</article>
	)
}
