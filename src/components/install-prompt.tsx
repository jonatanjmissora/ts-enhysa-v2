import { useInstall } from "#/hooks/use-install"

export function InstallPrompt() {
	const { isInstalled, canInstall, isIOS, install } = useInstall()

	if (isInstalled) return null

	if (isIOS) {
		return (
			<div className="w-full bg-amber-600/20 py-1 text-sm text-center text-pretty italic">
				Para instalar en iOS: Compartir → Añadir a pantalla de inicio
			</div>
		)
	}

	if (!canInstall) return null

	return (
		<div className="w-full bg-amber-600/20 py-1 text-sm flex justify-center items-center gap-2 text-pretty ">
			<span>Puede instalar la aplicacion!</span>
			<button type="button" onClick={() => install()} className="underline">
				Instalar
			</button>
		</div>
	)
}
