import { Button } from "#/components/ui/button"
import { LoginForm } from "@/components/login-form"
import { RegisterForm } from "@/components/register-form"
import { createFileRoute, Link } from "@tanstack/react-router"
import { useState } from "react"

export const Route = createFileRoute("/login/")({
	component: RouteComponent,
})

function RouteComponent() {
	const [activeForm, setActiveForm] = useState<"login" | "register">("login")
	const authPosition =
		activeForm === "login" ? "translate-x-[0px]" : "-translate-x-[100dvw]"

	return (
		<section className="w-screen h-screen overflow-hidden">
			<section
				className={`${authPosition} w-[200dvw] min-h-screen flex items-center justify-between gap-10 relative transition-transform duration-500`}
			>
				<Link to="/" className="absolute top-4 left-4">
					<Button variant={"outline"}>Home</Button>
				</Link>
				<div className="absolute left-0 top-1/2 -translate-y-1/2 w-screen flex justify-center items-center px-6">
					<LoginForm setActiveForm={setActiveForm} />
				</div>
				<div className="absolute right-0 top-1/2 -translate-y-1/2 w-screen flex justify-center items-center px-6">
					<RegisterForm setActiveForm={setActiveForm} />
				</div>
			</section>
		</section>
	)
}
