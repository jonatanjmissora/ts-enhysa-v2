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
		<section className="w-screen sm:max-w-5xl 2xl:max-w-7xl sm:mx-auto flex flex-col items-center justify-center">
			<Navbar />
			<Outlet />
			<Footer />
		</section>
	)
}
