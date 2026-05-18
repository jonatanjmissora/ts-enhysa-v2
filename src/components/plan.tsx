import { Link, useLocation } from "@tanstack/react-router"
import { CheckCircle, Shield } from "lucide-react"
import { Button } from "./ui/button"

export default function Plan() {
	const pathname = useLocation({
		select: location => location.pathname,
	})

	return (
		<div className="px-4 py-12 mb-40 flex-1 bg-accent flex flex-col gap-8 justify-between items-start text-lg relative w-11/12 rounded-lg">
			<div className="flex flex-col tracking-wider">
				<p className="text-2xl">Tu Suscripción</p>
				<p className="text-base">Plan Profesional</p>
				<p className="text-sm tracking-wider text-amber-700 dark:text-amber-500/50">
					Expira en 245 días
				</p>
			</div>

			<div className="pl-2 flex flex-col gap-3 sm:gap-4 py-4 text-sm tracking-wider">
				<div className="flex items-center gap-2">
					<CheckCircle
						size={15}
						className="text-green-700/75 dark:text-green-500/75"
					/>
					<p className="">Informes ilimitados</p>
				</div>
				<div className="flex items-center gap-2">
					<CheckCircle
						size={15}
						className="text-green-700/75 dark:text-green-500/75"
					/>
					<p className="">Croquis dinamico avanzado</p>
				</div>
				<div className="flex items-center gap-2">
					<CheckCircle
						size={15}
						className="text-green-700/75 dark:text-green-500/75"
					/>
					<p className="">Analisis con IA</p>
				</div>
				<div className="flex items-center gap-2">
					<CheckCircle
						size={15}
						className="text-green-700/75 dark:text-green-500/75"
					/>
					<p className="">Soporte prioritario</p>
				</div>
			</div>
			<Link
				to="/suscripcion"
				search={{ from: pathname.split("/")[1] }}
				className="w-full"
			>
				<Button className="w-full ring-foreground/25 py-5">
					Gestionar Plan
				</Button>
			</Link>

			<Shield
				className="absolute top-0 right-0 -rotate-20  sm:top-10 sm:right-10 size-34 2xl:size-44 text-amber-700 dark:text-amber-500/50"
				opacity={0.5}
			/>
		</div>
	)
}
