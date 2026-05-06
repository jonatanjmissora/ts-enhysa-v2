import Footer from "#/components/footer"
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
		<section className="w-screen flex flex-col items-center justify-center">
			<Navbar />
			<Outlet />
			<Footer />
		</section>
	)
}
