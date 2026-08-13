import Footer from "#/components/footer"
import Navbar from "#/components/navbar"
import { OfflineSessionGate } from "#/components/offline-session-gate"
import { Outlet, createFileRoute, useLoaderData } from "@tanstack/react-router"

export const Route = createFileRoute("/_protected")({
	component: RouteComponent,
})

function RouteComponent() {
	const rootSessionState = useLoaderData({ from: "__root__" })

	return (
		<OfflineSessionGate rootSessionState={rootSessionState}>
			<section className="w-screen sm:max-w-5xl 2xl:max-w-7xl sm:mx-auto flex flex-col items-center justify-center">
				<Navbar />
				<main className="w-full flex flex-col flex-1">
					<Outlet />
				</main>
				<Footer />
			</section>
		</OfflineSessionGate>
	)
}
