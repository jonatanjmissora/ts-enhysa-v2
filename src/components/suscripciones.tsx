import { PLANS } from "#/lib/constants"
import { montoFormat } from "#/lib/utils"
import { Link } from "@tanstack/react-router"
import { useState } from "react"
import { Label } from "./ui/label"
import { Check } from "lucide-react"
import { authClient } from "#/lib/auth-client"

export default function SuscriptionPlans({ from }: { from?: string }) {
	const { data: session } = authClient.useSession()
	const [actualPlan, setActualPlan] = useState<0 | 1 | 2>(1)
	const [anual, setAnual] = useState(false)

	const DISPLAY_PLANS = [PLANS[0], PLANS[1]]
	const combinedPlan = anual ? PLANS[3] : PLANS[2]
	return (
		<>
			<div className="flex flex-col sm:flex-row gap-20 my-15 w-full">
				{DISPLAY_PLANS.map((plan, index) => (
					<Plan
						key={plan.title}
						{...plan}
						index={index as 0 | 1}
						actualPlan={actualPlan}
						setActualPlan={setActualPlan}
						from={from}
					/>
				))}
				<CombinedPlan
					plan={combinedPlan}
					anual={anual}
					setAnual={setAnual}
					isActive={actualPlan === 2}
					onSelect={() => setActualPlan(2)}
					from={from}
				/>
			</div>
			<div className="flex flex-col sm:flex-row w-full items-center">
				<Link
					to={session?.user ? "/" : "/login"}
					className="bg-green-400 text-foreground border border-foreground/10 rounded-md px-7 py-3.5 text-base font-semibold transition-all hover:shadow-[0_4px_12px_rgba(92,184,92,0.3)] flex-1 text-center"
				>
					{session?.user ? "Continuar con Mi Cuenta" : "Ingresar con Mi Cuenta"}
				</Link>

				<div className="text-center flex gap-3 flex-col items-end justify-center py-20 ml-auto flex-1">
					<p>
						Lee nuestra{" "}
						<Link
							to="/teoria/politicas-de-privacidad"
							search={{ from: from ?? "suscripcion" }}
							className="underline"
						>
							Política de Privacidad
						</Link>
					</p>
					<p>
						y nuestros{" "}
						<Link
							to="/teoria/terminos-de-uso"
							search={{ from: from ?? "suscripcion" }}
							className="underline"
						>
							Términos de Uso
						</Link>
					</p>
				</div>
			</div>
		</>
	)
}

interface PlanProps {
	title: string
	price: number
	subtitle: string
	benefits: string[]
	index: 0 | 1
	actualPlan: 0 | 1 | 2
	setActualPlan: (plan: 0 | 1 | 2) => void
	from?: string
}

const Plan = ({
	title,
	price,
	subtitle,
	benefits,
	index,
	actualPlan,
	setActualPlan,
	from,
}: PlanProps) => {
	const { data: session } = authClient.useSession()
	return (
		<div
			onClick={() => setActualPlan(index as 0 | 1 | 2)}
			role="button"
			tabIndex={0}
			onKeyDown={e => {
				if (e.key === "Enter" || e.key === " ")
					setActualPlan(index as 0 | 1 | 2)
			}}
			className={`card border border-foreground/10 overflow-hidden relative sm:w-80 2xl:w-100 rounded-lg p-8 flex flex-col items-start gap-10 duration-300 cursor-pointer ${actualPlan === index ? "dark:bg-[#1f301f] bg-[#8dac8d] scale-100 sm:scale-120 z-5 " : "bg-accent"}`}
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
				<span className="text-5xl font-semibold text-foreground-soft">
					${montoFormat(price)}
				</span>
			</div>
			<span className="sm:text-base 2xl:text-lg font-medium tracking-wider text-foreground-soft">
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

			{index === 0 ? (
				<div className="flex flex-col gap-2 w-full">
					<Link
						to={session?.user ? "/" : "/login"}
						className={`w-full py-3 rounded-md text-center font-semibold block no-underline ${
							index === actualPlan ? "bg-green-400" : "bg-primary"
						}`}
					>
						{session?.user ? "Ir a Mi App" : "Prueba Gratis"}
					</Link>
				</div>
			) : (
				<Link
					to="/checkout"
					search={{
						plan: title,
						...(from ? { from } : {}),
					}}
					className={`w-full py-3 rounded-md text-center font-semibold block no-underline ${
						index === actualPlan ? "bg-green-400" : "bg-primary"
					}`}
				>
					Adquirir Crédito
				</Link>
			)}
		</div>
	)
}

function CombinedPlan({
	plan,
	anual,
	setAnual,
	isActive,
	onSelect,
	from,
}: {
	plan: (typeof PLANS)[number]
	anual: boolean
	setAnual: (v: boolean) => void
	isActive: boolean
	onSelect: () => void
	from?: string
}) {
	return (
		<button
			onClick={onSelect}
			type="button"
			className={`card border border-foreground/10 overflow-hidden relative sm:w-80 2xl:w-100 rounded-lg p-8 flex flex-col items-start gap-10 duration-300 cursor-pointer text-left ${isActive ? "dark:bg-[#1f301f] bg-[#8dac8d] scale-100 sm:scale-120 z-5 " : "bg-accent"}`}
		>
			{isActive && (
				<img
					src="/EnHySa_logo.webp"
					alt="logo EnHySa"
					className="absolute -z-10 -top-20 -right-20 sm:size-70 2xl:size-80 -rotate-15 opacity-20 object-cover"
				/>
			)}
			<div className="flex flex-col gap-2">
				<span className="sm:text-xl 2xl:text-3xl font-semibold tracking-widest">
					{plan.title}
				</span>
				<div className="flex flex-col gap-4">
					<span className="text-5xl font-semibold text-foreground-soft">
						${montoFormat(plan.price)}
					</span>
					<div>
						<Label
							className="flex items-center gap-3 cursor-pointer"
							onClick={e => e.stopPropagation()}
						>
							<input
								type="checkbox"
								checked={anual}
								onChange={e => setAnual(e.target.checked)}
								className="size-4 accent-[#5cb85c] rounded-[80%]"
							/>
							<span className="text-sm tracking-wider text-foreground-soft">
								Pago anual (ahorro 15%)
							</span>
						</Label>
					</div>
				</div>
			</div>

			<span className="sm:text-base 2xl:text-lg font-medium tracking-wider text-foreground-soft">
				{plan.subtitle}
			</span>
			<div className="flex flex-col gap-2">
				{plan.benefits.map(benefit => (
					<div key={benefit} className="flex gap-4">
						<Check className="sm:size-5 2xl:size-6" />
						<span className="sm:text-sm 2xl:text-base">{benefit}</span>
					</div>
				))}
			</div>

			<Link
				to="/checkout"
				search={{ plan: plan.title, ...(from ? { from } : {}) }}
				className={`w-full py-3 rounded-md text-center font-semibold block no-underline ${
					isActive ? "bg-green-400" : "bg-primary"
				}`}
			>
				Adquirir Créditos
			</Link>
		</button>
	)
}
