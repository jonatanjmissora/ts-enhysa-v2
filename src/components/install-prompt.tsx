import { useInstall } from "#/hooks/use-install"
import { useState } from "react"

export function InstallPrompt() {
	const { isInstalled, canInstall, isIOS, install } = useInstall()
	const [showModal, setShowModal] = useState(false)

	if (isInstalled)
		return (
			<div className="w-full bg-amber-600/20 py-1 text-sm text-center text-pretty italic">
				Aplicación ya instalada, utilice el icono del escritorio
			</div>
		)

	if (isIOS) {
		return (
			<div className="w-full bg-amber-600/20 py-1 text-sm text-center text-pretty italic">
				Para instalar en iOS: Compartir → Añadir a pantalla de inicio
			</div>
		)
	}

	if (!canInstall) return null

	const handleInstall = () => {
		void install()
		setShowModal(true)
	}

	const handleOk = () => {
		setShowModal(false)
		window.close()
	}

	return (
		<>
			<div className="w-full bg-amber-600/20 py-1 text-sm flex justify-center items-center gap-2 text-pretty">
				<span>Puede instalar la aplicacion!</span>
				<button type="button" onClick={handleInstall} className="underline">
					Instalar
				</button>
			</div>

			{showModal && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
					<div className="rounded-lg bg-zinc-800 p-6 text-sm text-white shadow-xl max-w-sm mx-4">
						<p className="mb-4 text-pretty">
							Luego de instalar, cierre esta ventana y utilice el icono del
							escritorio
						</p>
						<button
							type="button"
							onClick={handleOk}
							className="rounded bg-amber-600 px-4 py-2 text-xs font-medium hover:bg-amber-500"
						>
							OK
						</button>
					</div>
				</div>
			)}
		</>
	)
}
