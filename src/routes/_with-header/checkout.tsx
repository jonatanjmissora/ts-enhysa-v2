import { PLANS } from "@/lib/constants"
import { createFileRoute, Link } from "@tanstack/react-router"
import { ArrowLeft } from "lucide-react"
import { z } from "zod"

const searchSchema = z.object({
	plan: z.string().optional(),
	from: z.string().optional(),
})

export const Route = createFileRoute("/_with-header/checkout")({
	validateSearch: searchSchema,
	component: RouteComponent,
})

function RouteComponent() {
	const { plan, from } = Route.useSearch()
	const backTo = from === "landing" ? "/landing#suscriptions" : "/suscripcion"
	const found = PLANS.find(p => p.title.toLowerCase() === plan?.toLowerCase())

	return (
		<article className="font-sans antialiased">
			<div className="py-10 w-full sm:max-w-5xl 2xl:max-w-7xl sm:mx-auto flex flex-col gap-8 justify-center items-center px-0 sm:px-4">
				<Link
					to={backTo}
					className="self-start flex items-center gap-2 text-sm text-foreground/60 hover:text-foreground transition-colors"
				>
					<ArrowLeft size={16} />
					Volver
				</Link>
				{found ? (
					<div className="text-center space-y-4">
						<h1 className="text-3xl font-bold">Checkout</h1>
						<p>
							Estás a punto de adquirir el plan{" "}
							<strong className="text-[#e2711d]">{found.title}</strong>.
						</p>
						<p className="text-2xl font-semibold text-foreground/50">
							${found.price.toLocaleString("es-AR")}
						</p>
					</div>
				) : (
					<div className="text-center space-y-4">
						<h1 className="text-3xl font-bold">Plan no encontrado</h1>
						<p className="text-foreground/60">
							El plan <strong>{plan}</strong> no existe.
						</p>
						<Link
							to={backTo}
							className="text-[#e2711d] underline underline-offset-4 hover:text-[#d0610d] transition-colors"
						>
							Ver planes disponibles
						</Link>
					</div>
				)}
			</div>
		</article>
	)
}
