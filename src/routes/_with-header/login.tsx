import { LoginForm } from "@/components/login-form"
import { RegisterForm } from "@/components/register-form"
import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"

export const Route = createFileRoute("/_with-header/login")({
	component: RouteComponent,
})

function RouteComponent() {
	const [activeForm, setActiveForm] = useState<"login" | "register">("login")
	const authPosition =
		activeForm === "login" ? "translate-x-[0px]" : "-translate-x-[100dvw]"

	return (
		<section className="w-screen flex-1 overflow-hidden">
			<section
				className={`${authPosition} w-[200dvw] flex items-center justify-between gap-10 relative transition-transform duration-500`}
			>
				<div className="absolute left-0 top-20 sm:top-10 2xl:top-20 w-screen flex justify-center items-center px-6 bw">
					<LoginForm setActiveForm={setActiveForm} />
				</div>
				<div className="absolute right-0 top-20 sm:top-10 2xl:top-20 w-screen flex justify-center items-center px-6">
					<RegisterForm setActiveForm={setActiveForm} />
				</div>
			</section>
		</section>
	)
}
