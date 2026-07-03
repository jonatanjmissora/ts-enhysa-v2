import { WifiOff } from "lucide-react"
import { Button } from "@/components/ui/button"

export function OfflineRouteBlock() {
	return (
		<div className="min-w-0 flex-1 p-4 flex flex-col items-center justify-center gap-6 text-center">
			<WifiOff size={48} className="text-amber-500" />
			<div className="flex flex-col gap-2">
				<h2 className="text-xl font-bold">Sin conexión</h2>
				<p className="text-muted-foreground max-w-sm">
					No hay datos guardados para ver esta página offline. Volvé a una
					página que ya tengas cargada o reconectate para verla.
				</p>
			</div>
			<div className="flex gap-2 items-center flex-wrap justify-center">
				<Button
					variant="secondary"
					onClick={() => window.history.back()}
				>
					Volver
				</Button>
				<Button onClick={() => window.location.reload()}>
					Reintentar
				</Button>
			</div>
		</div>
	)
}
