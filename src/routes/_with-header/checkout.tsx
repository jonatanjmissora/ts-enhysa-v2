import { PLANS } from "@/lib/constants"
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router"
import { ArrowLeft, Check, Loader, LogIn } from "lucide-react"
import { z } from "zod"
import { testMpConnection } from "../../../server/mercadopago/test-conection"
import { createPreferenceServer } from "../../../server/mercadopago/create-preference-server"
import { authClient } from "#/lib/auth-client"
import { useState } from "react"

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
	const navigate = useNavigate()
	const { data: session, isPending } = authClient.useSession()
	const backTo = from === "landing" ? "/landing" : "/suscripcion"
	const found = PLANS.find(p => p.title.toLowerCase() === plan?.toLowerCase())
	const [mpStatus, setMpStatus] = useState<"idle" | "checking" | "connected" | "error">("idle")
	const [loading, setLoading] = useState(false)
	const [errorMsg, setErrorMsg] = useState<string | null>(null)

	const checkConnection = async () => {
		setMpStatus("checking")
		const result = await testMpConnection()
		setMpStatus(result.success ? "connected" : "error")
	}

	const handlePay = async () => {
		if (!found) return
		setLoading(true)
		setErrorMsg(null)
		try {
			const result = await createPreferenceServer({
				data: {
					planId: found.title.toLowerCase(),
					title: found.title,
					price: found.price,
				},
			})
			if (!result.initPoint) throw new Error("No se obtuvo URL de pago")
			window.location.href = result.initPoint
		} catch (err) {
			console.error("Error al crear preferencia MP:", err)
			const msg =
				err instanceof Error ? err.message :
				typeof err === "string" ? err :
				JSON.stringify(err)
			setErrorMsg(msg)
			setLoading(false)
		}
	}

	return (
		<article className="font-sans antialiased">
			<div className="py-10 w-full sm:max-w-5xl 2xl:max-w-7xl sm:mx-auto flex flex-col gap-8 justify-center items-center px-0 sm:px-4">
				<Link
					to={backTo}
					hash={from === "landing" ? "suscriptions" : ""}
					className="self-start flex items-center gap-2 text-sm text-foreground-soft hover:text-foreground transition-colors"
				>
					<ArrowLeft size={16} />
					Volver
				</Link>

				<button
					type="button"
					onClick={checkConnection}
					disabled={mpStatus === "checking" || mpStatus === "connected"}
					className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-md border border-foreground/10 hover:bg-accent transition-colors disabled:opacity-50"
				>
					{mpStatus === "idle" && "Verificar conexión con MP"}
					{mpStatus === "checking" && (
						<><Loader className="size-3 animate-spin" /> Verificando...</>
					)}
					{mpStatus === "connected" && (
						<><Check className="size-3 text-green-500" /> MP conectado</>
					)}
					{mpStatus === "error" && "Error de conexión — reintentar"}
				</button>

				{isPending ? (
					<Loader className="size-6 animate-spin text-foreground-soft" />
				) : !session ? (
					<div className="flex flex-col items-center gap-6 text-center">
						<LogIn size={48} className="text-foreground-soft" />
						<h1 className="text-2xl font-bold">Iniciá sesión para continuar</h1>
						<p className="text-foreground-soft text-sm max-w-md">
							Necesitás estar logueado para poder comprar créditos.
						</p>
						<button
							type="button"
							onClick={() => navigate({ to: "/login" })}
							className="py-3 px-8 rounded-md text-center font-semibold bg-[#e2711d] hover:bg-[#d0610d] text-white transition-colors"
						>
							Ir a Iniciar Sesión
						</button>
					</div>
				) : found ? (
					<div className="flex flex-col items-center gap-6">
						<div className="text-center space-y-4">
							<h1 className="text-3xl font-bold">Checkout</h1>
							<p>
								Estás a punto de adquirir el plan{" "}
								<strong className="text-[#e2711d]">{found.title}</strong>.
							</p>
							<p className="text-2xl font-semibold text-foreground-soft">
								${found.price.toLocaleString("es-AR")}
							</p>
						</div>
						<button
							type="button"
							onClick={handlePay}
							disabled={loading}
							className="w-full max-w-xs py-3 rounded-md text-center font-semibold bg-[#e2711d] hover:bg-[#d0610d] text-white transition-colors disabled:opacity-50"
						>
							{loading ? "Redirigiendo a MP..." : "Pagar con Mercado Pago"}
						</button>
						{errorMsg && (
							<p className="text-xs text-red-500 max-w-xs text-center">{errorMsg}</p>
						)}
					</div>
				) : (
					<div className="text-center space-y-4">
						<h1 className="text-3xl font-bold">Plan no encontrado</h1>
						<p className="text-foreground-soft">
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
