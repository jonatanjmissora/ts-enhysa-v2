import Navbar from "#/components/navbar"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/")({ component: Home })

function Home() {
	return (
		<section className="w-screen min-h-svh flex flex-col items-center justify-center">
			<Navbar />
			<div className="w-full flex-1 flex justify-center items-center border border-black">
				<span className="text-4xl font-bold">TanStack Start</span>
			</div>
		</section>
	)
}
