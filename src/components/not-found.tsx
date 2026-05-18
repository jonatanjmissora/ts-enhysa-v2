import { Link } from "@tanstack/react-router"
import { Button } from "./ui/button"
import useScrollTop from "#/hooks/scroll-top"

export default function NotFound() {
	useScrollTop()

	return (
		<section className="w-full sm:max-w-5xl 2xl:max-w-7xl sm:mx-auto min-h-svh flex flex-col items-center justify-center gap-20">
			<div className="flex justify-between items-center flex-col mt-0 sm:mt-10 h-[350px] sm:h-[450px] relative overflow-visible px-6 sm:w-2/3 mx-auto">
				<p className="text-xl font-semibold text-center tracking-wider text-pretty w/11/12 sm:w-2/3">
					Proximamente en nuevas actualizaciones. Estamos trabajando para ello.
					Disculpe las molestias.
				</p>
				<img
					src="/working-on-it.webp"
					alt="logo EnHySa"
					className="absolute opacity-75 top-20 left-0 w-screen sm:w-full object-contain h-[300px] sm:h-[350px] bottom-0 -z-10 max-w-none mask-t-from-50% mask-b-from-80%"
				/>
				<Link to="/" className="w-5/6 sm:w-1/2">
					<Button className="mt-[40svh] w-full py-5">Volver</Button>
				</Link>
			</div>
		</section>
	)
}
