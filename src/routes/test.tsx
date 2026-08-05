import { createFileRoute } from "@tanstack/react-router"
import { getCpshTokenServer } from "../../server/cpsh/get-cpsh-token-server"
import { verifyCpshRegistrationServer } from "../../server/cpsh/verify-cpsh-registration-server"
import { ChevronLeft, Loader2 } from "lucide-react"
import { useState } from "react"

export const Route = createFileRoute("/test")({
	loader: async () => {
		const result = await getCpshTokenServer()
		return result
	},
	component: RouteComponent,
})

function RouteComponent() {
	const data = Route.useLoaderData()

	return (
		<div className="min-h-svh flex flex-col items-center px-4 pt-14 sm:pt-20">
			<div className="max-w-2xl w-full flex flex-col gap-6">
				<button
					type="button"
					onClick={() => history.back()}
					className="inline-flex items-center gap-1 text-sm text-foreground-soft hover:text-foreground transition-colors"
				>
					<ChevronLeft className="size-4" />
					Volver
				</button>

				<h1 className="text-3xl font-bold tracking-wide">CPSH Test</h1>

				<div className="flex flex-col gap-6">
					<section className="bg-accent rounded-xl p-4 border border-foreground/10">
						<h2 className="text-lg font-semibold mb-2">CSRF Token</h2>
						<p className="text-xs text-foreground-soft break-all">
							{data.csrfToken}
						</p>
					</section>

					<section className="bg-accent rounded-xl p-4 border border-foreground/10">
						<h2 className="text-lg font-semibold mb-2">Cookies</h2>
						<p className="text-xs text-foreground-soft break-all">
							{data.cookies}
						</p>
					</section>

					<section className="bg-accent rounded-xl p-4 border border-foreground/10">
						<h2 className="text-lg font-semibold mb-4">
							Verificar matrícula
						</h2>
						<CpshForm />
					</section>
				</div>
			</div>
		</div>
	)
}

function CpshForm() {
	const [dni, setDni] = useState("")
	const [result, setResult] = useState<boolean | null>(null)
	const [error, setError] = useState<string | null>(null)
	const [loading, setLoading] = useState(false)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setError(null)
		setResult(null)
		setLoading(true)

		try {
			const res = await verifyCpshRegistrationServer({
				data: { dniOrCuit: dni },
			})
			setResult(res)
		} catch (e) {
			setError(e instanceof Error ? e.message : "Error desconocido")
		} finally {
			setLoading(false)
		}
	}

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-4">
			<input
				type="text"
				value={dni}
				onChange={(e) => setDni(e.target.value)}
				placeholder="DNI o CUIT"
				className="w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-sm"
			/>
			<button
				type="submit"
				disabled={loading || !dni.trim()}
				className="inline-flex items-center justify-center gap-2 rounded-md bg-[#e2711d] px-4 py-2 text-sm font-semibold text-white hover:bg-[#d0610d] disabled:opacity-50"
			>
				{loading && <Loader2 className="size-4 animate-spin" />}
				{loading ? "Consultando..." : "Verificar"}
			</button>

			{result !== null && (
				<div className="mt-2">
					<p className="text-sm font-semibold">
						Resultado:{" "}
						<span className={result ? "text-green-600" : "text-red-600"}>
							{result ? "Tiene matrícula" : "Sin matrícula"}
						</span>
					</p>
				</div>
			)}

			{error && (
				<div className="mt-2">
					<p className="text-sm text-red-600">Error: {error}</p>
				</div>
			)}
		</form>
	)
}
