import { WifiOff } from "lucide-react"
import { Link } from "@tanstack/react-router"

export function OfflineRouteBlock() {
	return (
		<div className="min-h-svh flex flex-col items-center justify-center gap-6 px-6 text-center">
			<WifiOff size={48} className="text-amber-500" />
			<div className="flex flex-col gap-2">
				<h2 className="text-xl font-bold">Sin conexión</h2>
				<p className="text-muted-foreground max-w-sm">
					Esta página no está guardada en tu dispositivo. Volvé a una página que
					ya tengas cargada o reconectate para verla.
				</p>
			</div>
			<div className="flex gap-2 items-center flex-wrap justify-center">
				<Link
					to="/"
					className="px-4 py-2 bg-amber-600 hover:bg-amber-700 rounded-sm text-white uppercase font-extrabold cursor-pointer"
				>
					Ir al inicio
				</Link>
			</div>
			<p className="text-xs text-muted-foreground">
				Al reconectarte, la pagina se recarga automaticamente.
			</p>
		</div>
	)
}
