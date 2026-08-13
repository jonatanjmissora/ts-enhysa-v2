import { useSuspenseQuery } from "@tanstack/react-query"
import { tecnicoQueryOptions } from "../../queries/tecnico/tecnico-query"
import { verifyCpshRegistrationServer } from "../../server/cpsh/verify-cpsh-registration-server"
import { Link } from "@tanstack/react-router"
import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import { useAppSession } from "#/lib/app-session-context"

const CPSH_DISCOUNT = 0.15

type CheckMatriculadoProps = {
	basePrice: number
	onDiscountChange: (discountedPrice: number) => void
	onCheckingChange?: (checking: boolean) => void
}

export function CheckMatriculado({
	basePrice,
	onDiscountChange,
	onCheckingChange,
}: CheckMatriculadoProps) {
	const { session } = useAppSession()
	if (!session) {
		return (
			<div className="text-foreground-soft text-center flex flex-col justify-center items-center">
				<span>Debe iniciar sesión para verificar su matrícula.</span>
			</div>
		)
	}

	return (
		<CheckMatriculadoContent
			basePrice={basePrice}
			onDiscountChange={onDiscountChange}
			onCheckingChange={onCheckingChange}
			userId={session.user.id}
		/>
	)
}

function CheckMatriculadoContent({
	basePrice,
	onDiscountChange,
	onCheckingChange,
	userId,
}: CheckMatriculadoProps & { userId: string }) {
	const { data: tecnico } = useSuspenseQuery(tecnicoQueryOptions(userId))
	const tecnicoData = Array.isArray(tecnico) ? (tecnico[0] ?? null) : tecnico
	const dni = tecnicoData?.dni ?? null

	const [checking, setChecking] = useState(!!dni)
	const [isRegistered, setIsRegistered] = useState<boolean | null>(null)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		onCheckingChange?.(checking)
	}, [checking, onCheckingChange])

	useEffect(() => {
		if (!tecnicoData || !dni) return
		let cancelled = false

		const verify = async () => {
			setChecking(true)
			setError(null)
			setIsRegistered(null)
			try {
				const result = await verifyCpshRegistrationServer({
					data: { dniOrCuit: String(dni) },
				})
				if (!cancelled) {
					setIsRegistered(result)
					onDiscountChange(
						result ? Math.round(basePrice * (1 - CPSH_DISCOUNT)) : basePrice
					)
				}
			} catch (e) {
				if (!cancelled) {
					setError(
						e instanceof Error ? e.message : "Error al verificar matrícula"
					)
					onDiscountChange(basePrice)
				}
			} finally {
				if (!cancelled) setChecking(false)
			}
		}

		verify()
		return () => {
			cancelled = true
		}
	}, [tecnicoData, dni, basePrice, onDiscountChange])

	if (!tecnicoData || !dni) {
		return (
			<div className="text-foreground-soft text-center flex flex-col justify-center items-center">
				<span>Debe completar su perfil para verificar su matrícula.</span>
				<Link
					to="/perfil/tecnicos"
					className="text-[#e2711d] underline underline-offset-4 hover:text-[#d0610d]"
				>
					Completar perfil
				</Link>
			</div>
		)
	}

	return (
		<div className="flex flex-col gap-3 text-sm">
			{checking && (
				<div className="inline-flex items-center justify-center gap-2">
					<Loader2 className="size-4 animate-spin" />
					<span>Verificando matrícula...</span>
				</div>
			)}

			{isRegistered !== null && !checking && (
				<p className="tracking-wider">
					Matriculado :{" "}
					<span
						className={
							isRegistered
								? "text-semibold text-green-700"
								: "text-semibold text-red-700"
						}
					>
						{isRegistered ? "SI" : "NO"}
					</span>
				</p>
			)}

			{error && !checking && (
				<p className="text-sm text-red-600">Error: {error}</p>
			)}
		</div>
	)
}
