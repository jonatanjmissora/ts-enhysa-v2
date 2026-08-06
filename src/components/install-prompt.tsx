import { useInstall } from "#/hooks/use-install"
import { useState, useEffect } from "react"
import { X } from "lucide-react"

export function InstallPrompt() {
	const { isInstalled, canInstall, isIOS, install } = useInstall()
	const [dismissed, setDismissed] = useState(false)

	useEffect(() => {
		const stored = localStorage.getItem("install-banner-dismissed")
		if (stored === "true") setDismissed(true)
	}, [])

	const dismiss = () => {
		localStorage.setItem("install-banner-dismissed", "true")
		setDismissed(true)
	}

	if (isInstalled || dismissed) return null

	if (isIOS) {
		return (
			<div className="fixed bottom-1 left-1 z-50 relative rounded-lg bg-zinc-800 px-4 py-3 text-sm text-white shadow-lg">
				<button
					type="button"
					onClick={dismiss}
					className="absolute top-2 right-2 text-zinc-400 hover:text-white"
				>
					<X size={14} />
				</button>
				Para instalar en iOS: Compartir → Añadir a pantalla de inicio
			</div>
		)
	}

	if (!canInstall) return null

	return (
		<div className="fixed bottom-1 left-1 z-50 relative rounded-lg bg-zinc-800 px-4 py-3 text-sm text-white shadow-lg">
			<button
				type="button"
				onClick={dismiss}
				className="absolute top-2 right-2 text-zinc-400 hover:text-white"
			>
				<X size={14} />
			</button>
			<p className="mb-2">Puede instalar la aplicacion!</p>
			<button
				type="button"
				onClick={() => install()}
				className="rounded bg-amber-600 px-3 py-1.5 text-xs font-medium hover:bg-amber-500"
			>
				Instalar
			</button>
		</div>
	)
}
