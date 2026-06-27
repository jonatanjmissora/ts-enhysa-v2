import BackChevron from "#/components/back-chevron"
import { Button } from "#/components/ui/button"
import { PLANS } from "@/lib/constants"
import { createFileRoute, Link } from "@tanstack/react-router"
import { ArrowRight, Check, Shield } from "lucide-react"
import { useState } from "react"
import { z } from "zod"

const fromSearchSchema = z.object({
	from: z.string().optional(),
})

export const Route = createFileRoute("/_protected/suscripcion")({
	component: RouteComponent,
	validateSearch: fromSearchSchema,
})

function RouteComponent() {
	const [actualPlan, setActualPlan] = useState<0 | 1 | 2>(1)

	return (
		<div className="min-h-svh flex flex-col relative mb-30">
			<BackChevron className="top-4 left-4" />

			<div className="flex-1 flex justify-center items-center flex-col gap-6 pt-20 sm:py-10 2xl:py-20">
				<div className="flex items-center gap-2 text-5xl 2xl:text-6xl font-bold tracking-wildest relative">
					<span>Planes</span>
					<Shield className="absolute top-1/2 left-full -translate-1/2 size-30 2xl:size-50 -rotate-15 dark:text-amber-300/60 text-amber-800/80 -z-10" />
				</div>
				<div>
					<p className="italic tracking-wider font-semibold text-pretty text-sm w-5/6 mx-auto text-center text-foreground/50">
						Tu actual plan es el "Plan Profesional". ¿Deseas cambiar a plan
						Empresarial? Checkea los beneficios de subir de plan.
					</p>
				</div>
				<div className="flex flex-col sm:flex-row gap-20 my-15 w-5/6">
					{PLANS.map((plan, index) => (
						<Plan
							key={plan.title}
							{...plan}
							index={index}
							actualPlan={actualPlan}
							setActualPlan={setActualPlan}
						/>
					))}
				</div>
				<div className="text-center flex gap-3 flex-col items-center justify-center">
					<p>
						Lee nuestra{" "}
						<Link to="/teoria/politicas-de-privacidad" className="underline">
							Política de Privacidad
						</Link>
					</p>
					<p>
						y nuestros{" "}
						<Link to="/teoria/terminos-de-uso" className="underline">
							Términos de Uso
						</Link>
					</p>
				</div>
			</div>
		</div>
	)
}

interface PlanProps {
	title: string
	price: number
	subtitle: string
	benefits: string[]
	index: number
	actualPlan: 0 | 1 | 2
	setActualPlan: (plan: 0 | 1 | 2) => void
}

const Plan = ({
	title,
	price,
	subtitle,
	benefits,
	index,
	actualPlan,
	setActualPlan,
}: PlanProps) => {
	return (
		<div
			className={`overflow-hidden relative  sm:w-80 2xl:w-100 rounded-lg p-8  flex flex-col items-start gap-10 duration-300 ${actualPlan === index ? "dark:bg-[#1f301f] bg-[#8dac8d] scale-100 sm:scale-120 z-10 " : "bg-accent"}`}
		>
			{actualPlan === index && (
				<img
					src="/EnHySa_logo.webp"
					alt="logo EnHySa"
					className="absolute -z-10 -top-20 -right-20 sm:size-70 2xl:size-80 -rotate-15 opacity-20 object-cover"
				/>
			)}
			<div className="flex flex-col gap-2">
				<span className="sm:text-xl 2xl:text-3xl font-semibold tracking-widest">
					{title}
				</span>
				<span className="text-5xl font-semibold text-foreground/50">
					${price}
				</span>
			</div>
			<span className="sm:text-base 2xl:text-lg font-medium tracking-wider text-foreground/70">
				{subtitle}
			</span>
			<div className="flex flex-col gap-2">
				{benefits.map(benefit => (
					<div key={benefit} className="flex gap-4">
						<Check className="sm:size-5 2xl:size-6" />
						<span className="sm:text-sm 2xl:text-base">{benefit}</span>
					</div>
				))}
			</div>

			<Button
				variant={actualPlan !== index ? "default" : "outline"}
				className="w-full py-5"
				onClick={() => setActualPlan(index as 0 | 1 | 2)}
			>
				{actualPlan === index ? (
					<span>Actual Plan</span>
				) : (
					<>
						<span>Adquirir Plan</span>
						<ArrowRight className="size-5" />
					</>
				)}
			</Button>
		</div>
	)
}
