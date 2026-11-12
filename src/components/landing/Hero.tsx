import { useNavigate } from "@tanstack/react-router"
import { useEffect, useState } from "react"
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "../ui/alert-dialog"
import { authClient } from "#/lib/auth-client"

export default function Hero() {
	const { data: session } = authClient.useSession()
	const navigate = useNavigate()
	const [androidOnlyDialogOpen, setAndroidOnlyDialogOpen] = useState(false)

	const handleApkClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
		if (!/Android/i.test(navigator.userAgent)) {
			event.preventDefault()
			setAndroidOnlyDialogOpen(true)
		}
	}

	const scrollToHash = (hash: string) => () => {
		navigate({ to: "/landing", hash })
		requestAnimationFrame(() => {
			document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" })
		})
	}

	return (
		<section className="pt-20 pb-50 sm:py-10 2xl:py-50">
			<div className="w-full sm:max-w-5xl 2xl:max-w-7xl sm:mx-auto grid grid-cols-1 md:grid-cols-[1.2fr_0.8fr] gap-32 md:gap-12 items-center justify-center max-md:text-center px-0 sm:px-4">
				<div className="flex flex-col items-center justify-center gap-8">
					<span className="inline-block text-[#e2711d] px-3.5 py-1.5 rounded-full text-sm font-semibold mb-5 border border-[rgba(226,113,29,0.2)]">
						Resolución 84/12 & 85/12 SRT Automáticas
					</span>
					<h1 className="text-2xl md:text-5xl text-pretty leading-tight font-bold mb-5 text-center">
						Digitalizá tus Auditorías de{" "}
						<span className="text-[#e2711d]">Seguridad e Higiene</span>
					</h1>
					<p className="text-foreground-soft mb-8 px-4 sm:px-0 max-w-150 max-md:mx-auto">
						La plataforma técnica definitiva para profesionales en Argentina.
						Automatizá el cálculo del Índice de Local (K), gestioná tus
						mediciones con luxómetros y generá protocolos listos para firmar en
						minutos.
					</p>
					<div className="flex gap-12 flex-wrap justify-center items-center">
						<button
							type="button"
							onClick={() => navigate({ to: session?.user ? "/" : "/login" })}
							className="bg-[#1a1a1a] rounded-md px-7 py-3.5 text-base font-semibold border border-[#333] transition-all hover:bg-[#222] text-white/70"
						>
							{session?.user ? "Continuar con la App" : "Probar la App Online"}
						</button>
						<button
							type="button"
							onClick={scrollToHash("modulos")}
							className="bg-[#1a1a1a] rounded-md px-7 py-3.5 text-base font-semibold border border-[#333] transition-all hover:bg-[#222] text-white/70"
						>
							Ver Módulos Técnicos
						</button>
						<a
							href="https://github.com/jonatanjmissora/expo-enhysa/releases/latest/download/enhysa-android.apk"
							onClick={handleApkClick}
							className="bg-[#5cb85c] rounded-md px-7 py-3.5 text-base font-semibold transition-all hover:bg-[#235223]"
						>
							Descargar para Android
						</a>
					</div>
				</div>
				<PhoneMockup />
				<AlertDialog
					open={androidOnlyDialogOpen}
					onOpenChange={setAndroidOnlyDialogOpen}
				>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>
								EnHySa es una app para Android
							</AlertDialogTitle>
							<AlertDialogDescription>
								Para descargarla e instalarla, debes ingresar a esta página
								desde un dispositivo Android.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogAction
								onClick={() => setAndroidOnlyDialogOpen(false)}
							>
								Entendido
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</div>
		</section>
	)
}

function PhoneMockup() {
	const images = [
		"/animation1.webp",
		"/animation2.webp",
		"/animation3.webp",
		"/animation4.webp",
	]
	const [current, setCurrent] = useState(0)

	useEffect(() => {
		const timer = setInterval(() => {
			setCurrent(prev => (prev + 1) % images.length)
		}, 3000)
		return () => clearInterval(timer)
	}, [images.length])

	return (
		<div className="relative w-full max-w-[320px] mx-auto aspect-9/16">
			{images.map((src, i) => (
				<img
					key={src}
					src={src}
					alt={`Slide ${i + 1}`}
					className="absolute inset-0 w-full h-full object-contain transition-opacity duration-700"
					style={{ opacity: i === current ? 1 : 0 }}
				/>
			))}
		</div>
	)
}
