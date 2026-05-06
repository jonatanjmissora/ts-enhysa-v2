import { Button } from "#/components/ui/button"
import { createFileRoute, Link } from "@tanstack/react-router"

export const Route = createFileRoute("/_protected/dashboard/")({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<article className="h-full w-full flex flex-col items-center justify-center gap-6">
			<nav className="flex items-center gap-10 text-xl">
				<Link to="/">
					<Button variant={"outline"}>Home</Button>
				</Link>
				<Link to="/login">
					<Button variant={"outline"}>Login</Button>
				</Link>
			</nav>
			<span className="text-4xl font-bold">Dashoard</span>
		</article>
	)
}
