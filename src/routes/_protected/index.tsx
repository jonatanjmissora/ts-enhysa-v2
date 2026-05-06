import Plan from "#/components/plan"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "#/components/ui/select"
import { PROTOCOLOS } from "#/lib/constants"
import { createFileRoute, Link } from "@tanstack/react-router"

export const Route = createFileRoute("/_protected/")({ component: Home })

function Home() {
	return (
		<article className="w-full min-h-svh flex flex-col items-center justify-center gap-20">
			<div className="flex justify-between items-center flex-col mt-[70px] h-[550px] relative overflow-visible px-6">
				<p className="text-[26px] text-center tracking-wider text-pretty px-3 dark:text-shadow-lg">
					Selecciona tu nuevo informe.
				</p>
				<img
					src="/movil-hero.webp"
					alt="logo EnHySa"
					className="absolute opacity-75 top-6 left-0 w-screen h-[500px] bottom-0 -z-10 max-w-none mask-t-from-50% mask-b-from-80%"
				/>
				<Select>
					<SelectTrigger className="flex items-center justify-between gap-6 p-6 textM font-semibold rounded-xl themeBtnAccent  my-shadow w-full sm:w-auto dark:text-shadow-lg/50">
						<SelectValue placeholder="Selecciona un protocolo" />
					</SelectTrigger>
					<SelectContent>
						{PROTOCOLOS.map(protocolo => (
							<SelectItem
								key={protocolo.id}
								value={protocolo.id}
								className="text-right! text-nowrap! flex justify-start! py-2 truncate"
							>
								<Link to={protocolo.link} resetScroll={true}>
									{protocolo.title}
								</Link>
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
			<span className="text-pretty w-5/6 text-base tracking-wider italic text-foreground/60 mt-20 h-[40svh]">
				Elige entre un monton de nuestros protocolos y genera tu informe en
				minutos. Te permitira tomar datos en obra para generar tus informes de
				calculo y planos. Listos para entregar y guardar en la nube.
			</span>
			<Plan />
		</article>
	)
}
