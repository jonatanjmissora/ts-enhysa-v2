import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { CheckCircle, Loader, ArrowRight } from "lucide-react"
import { z } from "zod"
import { useEffect, useState, useRef } from "react"
import { syncPaymentServer } from "../../../server/mercadopago/sync-payment-server"
import { PLANS } from "@/lib/constants"

const searchSchema = z.object({
	payment_id: z.coerce.number().optional(),
	status: z.string().optional(),
	from: z.string().optional(),
})

export const Route = createFileRoute("/_protected/pago-exitoso")({
	validateSearch: searchSchema,
	component: RouteComponent,
})

type SyncState =
	| { phase: "processing"; attempt: number }
	| { phase: "approved"; credits: number }
	| { phase: "timeout" }

const MAX_ATTEMPTS = 10
const POLL_INTERVAL = 2000

function RouteComponent() {
	const { payment_id, status, from } = Route.useSearch()
	const navigate = useNavigate()
	const [syncState, setSyncState] = useState<SyncState>(
		status === "approved"
			? { phase: "processing", attempt: 0 }
			: { phase: "timeout" }
	)
	const attemptsRef = useRef(0)
	const mountedRef = useRef(true)

	useEffect(() => {
		if (status !== "approved" || !payment_id) return

		let timeoutId: ReturnType<typeof setTimeout>

		const poll = async () => {
			if (!mountedRef.current) return
			attemptsRef.current++

			try {
				const result = await syncPaymentServer({
					data: { paymentId: payment_id },
				})

				if (!mountedRef.current) return

				if (result.status === "approved") {
					setSyncState({ phase: "approved", credits: result.credits ?? 0 })
					return
				}

				if (result.status === "rejected" || result.status === "cancelled") {
					setSyncState({ phase: "timeout" })
					return
				}
			} catch {
				if (!mountedRef.current) return
			}

			if (attemptsRef.current >= MAX_ATTEMPTS) {
				setSyncState({ phase: "timeout" })
				return
			}

			timeoutId = setTimeout(poll, POLL_INTERVAL)
		}

		poll()

		return () => {
			mountedRef.current = false
			clearTimeout(timeoutId)
		}
	}, [status, payment_id])

	const planName =
		syncState.phase === "approved"
			? (PLANS.find(p => p.credits === syncState.credits)?.title ??
				"Por Informe")
			: null

	return (
		<div className="min-h-svh flex flex-col gap-4 items-center px-4 pt-14 sm:pt-20">
			<div className="max-w-md w-full flex flex-col items-center gap-6 text-center">
				{syncState.phase === "processing" && (
					<div className="flex flex-col gap-6">
						<div className="flex flex-col gap-8 items-center">
							<Loader className="size-18 animate-spin text-[#e2711d]" />
							<h1 className="text-4xl font-bold text-balance">
								Procesando
								<span> tu pago...</span>
							</h1>
						</div>
						<div className="bg-accent rounded-xl p-4 w-full space-y-5 py-10 border border-foreground/10">
							<p className="text-foreground-soft text-sm">
								Estamos sincronizando tu pago, en breve verás los créditos
								reflejados en tu cuenta.
							</p>
							{payment_id && (
								<p className="text-xs text-foreground-soft">
									Referencia de Pago: #{payment_id} — Intento{" "}
									{attemptsRef.current}/{MAX_ATTEMPTS}
								</p>
							)}
						</div>
					</div>
				)}

				{syncState.phase === "approved" && (
					<>
						<CheckCircle className="size-18 text-green-600" />
						<h1 className="text-4xl font-bold tracking-wide">¡Pago exitoso!</h1>
						<div className="bg-accent rounded-xl p-4 w-full space-y-5 py-10  border border-foreground/10">
							{payment_id && (
								<p className="text-xs text-foreground-soft">
									Referencia de Pago #{payment_id}
								</p>
							)}
							{planName && (
								<p className="text-lg font-semibold">Plan: {planName}</p>
							)}
							<p className="text-3xl font-bold text-[#e2711d]">
								+{syncState.credits} crédito{syncState.credits !== 1 ? "s" : ""}
							</p>
						</div>
						<button
							type="button"
							onClick={() => navigate({ to: "/suscripcion", search: { from } })}
							className="inline-flex items-center gap-2 py-3 px-8 rounded-md font-semibold bg-[#e2711d] hover:bg-[#d0610d] text-white transition-colors"
						>
							Volver a Suscripciones
							<ArrowRight className="size-4" />
						</button>
					</>
				)}

				{syncState.phase === "timeout" && status !== "approved" && (
					<>
						<h1 className="text-2xl font-bold">Pago no aprobado</h1>
						<p className="text-foreground-soft text-sm">
							El pago no pudo ser procesado. Podés intentar nuevamente desde la
							sección de suscripciones.
						</p>
						<button
							type="button"
							onClick={() => navigate({ to: "/suscripcion" })}
							className="inline-flex items-center gap-2 py-3 px-8 rounded-md font-semibold bg-[#e2711d] hover:bg-[#d0610d] text-white transition-colors"
						>
							Volver a Suscripciones
							<ArrowRight className="size-4" />
						</button>
					</>
				)}

				{syncState.phase === "timeout" && status === "approved" && (
					<>
						<Loader className="size-12 animate-spin text-foreground-soft" />
						<h1 className="text-2xl font-bold">Estamos procesando tu pago</h1>
						<p className="text-foreground-soft text-sm">
							Tu pago fue aprobado por Mercado Pago pero estamos esperando la
							confirmación final. Los créditos se acreditarán automáticamente en
							los próximos minutos.
						</p>
						{payment_id && (
							<p className="text-xs text-foreground-soft/60">
								Referencia: #{payment_id}
							</p>
						)}
						<button
							type="button"
							onClick={() => navigate({ to: "/suscripcion" })}
							className="inline-flex items-center gap-2 py-3 px-8 rounded-md font-semibold bg-[#e2711d] hover:bg-[#d0610d] text-white transition-colors"
						>
							Volver a Suscripciones
							<ArrowRight className="size-4" />
						</button>
					</>
				)}
			</div>
		</div>
	)
}
