import { useInstall } from "#/hooks/use-install"
import { useInstalledFlag } from "#/store/install-store"

export function InstallPrompt() {
	const { isStandalone, canInstall, isIOS, install } = useInstall()
	const installed = useInstalledFlag()

	if (isStandalone) return null

	if (isIOS && !installed) {
		return (
			<div className="w-full bg-amber-600/20 py-2 text-sm text-center text-pretty italic">
				Para instalar en iOS: Compartir → Añadir a pantalla de inicio
			</div>
		)
	}

	if (installed) {
		return (
			<div className="w-full bg-amber-600/20 py-2 text-sm text-center text-pretty italic">
				Aplicación ya instalada, utilice el icono del escritorio
			</div>
		)
	}

	if (!canInstall) return null

	return (
		<div className="w-full bg-amber-600/20 py-2 text-sm flex justify-center items-center gap-2 text-pretty">
			<span>Puede instalar la aplicación</span>
			<button type="button" onClick={() => install()} className="underline">
				Instalar
			</button>
		</div>
	)
}
