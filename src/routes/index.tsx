import { Button } from "#/components/ui/button"
import { createFileRoute, Link } from "@tanstack/react-router"

export const Route = createFileRoute("/")({ component: Home })

function Home() {
	return (
		<section className="w-screen min-h-svh flex flex-col items-center justify-center gap-8">
			<nav className="flex items-center gap-10">
				<Link to="/dashboard">
					<Button variant={"outline"}>Dashboard</Button>
				</Link>
				<Link to="/login">
					<Button variant={"outline"}>Login</Button>
				</Link>
			</nav>
			<span className="text-4xl font-bold">TanStack Start</span>
		</section>
	)
}
