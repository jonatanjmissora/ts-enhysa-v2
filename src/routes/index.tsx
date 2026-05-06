import { createFileRoute, Link } from "@tanstack/react-router"

export const Route = createFileRoute("/")({ component: Home })

function Home() {
	return (
		<section className="w-screen min-h-svh flex flex-col items-center justify-center gap-8">
			<nav className="flex items-center gap-10">
				<Link to="/dashboard">Dashboard</Link>
				<Link to="/login">Login</Link>
			</nav>
			<span className="text-4xl font-bold">TanStack Start</span>
		</section>
	)
}
