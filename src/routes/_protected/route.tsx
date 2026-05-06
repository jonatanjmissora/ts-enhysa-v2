import Navbar from "#/components/navbar"
import { protectedRoute } from "#/lib/protected-route"
import { Outlet } from "@tanstack/react-router"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_protected")({
	loader: async () => await protectedRoute(),
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<section className="w-screen min-h-svh flex flex-col items-center justify-center">
			<Navbar />
			<article className="w-full flex-1 flex flex-col items-center justify-center">
				<Outlet />
			</article>
		</section>
	)
}
