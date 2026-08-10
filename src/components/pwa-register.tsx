import { useEffect, useState } from "react"

export function PWARegister() {
	const [needRefresh, setNeedRefresh] = useState(false)

	useEffect(() => {
		if (import.meta.env.DEV) {
			navigator.serviceWorker?.getRegistrations().then(regs => {
				for (const reg of regs) {
					reg.active?.postMessage({ type: "UNREGISTER" })
					reg.unregister()
				}
			})
			return
		}
		if (!("serviceWorker" in navigator)) return

		navigator.serviceWorker.register("/sw.js").then(reg => {
			if (reg.waiting) {
				setNeedRefresh(true)
			}

			reg.addEventListener("updatefound", () => {
				const newWorker = reg.installing
				if (!newWorker) return

				newWorker.addEventListener("statechange", () => {
					if (
						newWorker.state === "installed" &&
						navigator.serviceWorker.controller
					) {
						setNeedRefresh(true)
					}
				})
			})
		})

		navigator.serviceWorker.addEventListener("controllerchange", () => {
			window.location.reload()
		})

		return () => {
			// NOTA: no desregistramos el SW al desmontar — eso rompe
			// la funcionalidad offline si el componente se re-renderiza.
		}
	}, [])

	if (import.meta.env.DEV) return null

	return (
		<>
			{needRefresh && (
				<div className="fixed bottom-4 right-4 z-50 flex items-center gap-3 rounded-lg bg-zinc-800 px-4 py-3 text-sm text-white shadow-lg">
					<span>Nueva versi&oacute;n disponible</span>
					<button
						onClick={() =>
							navigator.serviceWorker.controller?.postMessage({
								type: "SKIP_WAITING",
							})
						}
						className="rounded bg-blue-600 px-3 py-1 text-xs font-medium hover:bg-blue-500"
					>
						Actualizar
					</button>
					<button
						onClick={() => setNeedRefresh(false)}
						className="text-xs text-zinc-400 hover:text-white"
					>
						Cerrar
					</button>
				</div>
			)}
		</>
	)
}
