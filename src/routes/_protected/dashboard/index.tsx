import { createFileRoute, Link } from "@tanstack/react-router"

export const Route = createFileRoute("/_protected/dashboard/")({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<article className="h-full w-full flex flex-col items-center justify-center gap-6">
			<nav className="flex items-center gap-10">
				<Link to="/">Home</Link>
				<Link to="/login">Login</Link>
			</nav>
			<span className="text-4xl font-bold">Dashoard</span>
		</article>
	)
}
