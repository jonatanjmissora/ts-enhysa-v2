import { Menu, UserRound, X } from "lucide-react"
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogTitle,
	AlertDialogDescription,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"
import { getUserInfo } from "@/lib/utils"
import { Link, useLoaderData, useNavigate } from "@tanstack/react-router"
import { LogOut, Shield } from "lucide-react"
import { useState } from "react"
import { Theme } from "./theme"
import { resetDemoData } from "../../server/reset-demo-data-server"
import { useQuery } from "@tanstack/react-query"
import { userCreditsOptions } from "../../queries/credits/user-credits-query"

const DEMO_EMAIL_PREFIX = "demo"
const DEMO_EMAIL_DOMAIN = "@enhysa.demo"

export default function Navbar() {
	const [isOpen, setIsOpen] = useState(false)
	return (
		<header
			className={`w-full relative h-18 flex items-center justify-between p-4 text-foreground`}
		>
			<Link to="/" className="flex items-center gap-3">
				<img
					src="/EnHySa_logo.webp"
					alt="logo EnHySa"
					className="size-10 object-cover"
				/>

				<p className="text-2xl">EnHySa App</p>
			</Link>
			<button
				onClick={() => setIsOpen(!isOpen)}
				aria-label="Abrir menú de navegación"
			>
				<Menu className="size-7" />
			</button>
			<MovilMenuContent isOpen={isOpen} setIsOpen={setIsOpen} />
		</header>
	)
}

const MovilMenuContent = ({
	isOpen,
	setIsOpen,
}: {
	isOpen: boolean
	setIsOpen: (open: boolean) => void
}) => {
	return (
		<div
			className={` flex flex-col justify-between items-center fixed z-10 inset-0 bg-background w-screen h-svh  ${isOpen ? "translate-y-0" : "-translate-y-full"} transition-transform duration-500 text-foreground`}
		>
			<div className="h-25 w-full sm:max-w-2xl 2xl:max-w-3xl sm:mx-auto flex items-center justify-end p-8">
				<button
					onClick={() => setIsOpen(!isOpen)}
					aria-label="Cerrar menú de navegación"
				>
					<X className="size-7" />
				</button>
			</div>

			<ul className="flex flex-col gap-5 text-2xl tracking-widest font-semibold flex-1 items-center justify-center w-5/6 sm:max-w-2xl 2xl:max-w-3xl sm:mx-auto ">
				<li className="w-full">
					<Link
						to="/landing"
						onClick={() => setIsOpen(!isOpen)}
						resetScroll={true}
						className="w-full py-2 text-center block"
					>
						¿Qué es EnHySa App?
					</Link>
				</li>
				<li className="w-full">
					<Link
						to="/"
						onClick={() => setIsOpen(!isOpen)}
						resetScroll={true}
						className="w-full py-2 text-center block"
					>
						Inicio
					</Link>
				</li>
				<li className="w-full">
					<Link
						to="/perfil/tecnicos"
						onClick={() => setIsOpen(!isOpen)}
						resetScroll={true}
						className="w-full py-2 text-center block"
					>
						Mi Perfil
					</Link>
				</li>
				<li className="w-full">
					<Link
						to="/suscripcion"
						search={{
							from: "root",
						}}
						onClick={() => setIsOpen(!isOpen)}
						resetScroll={true}
						className="w-full py-2 text-center block"
					>
						Suscripción
					</Link>
				</li>
			</ul>
			<User setIsOpen={setIsOpen} />
			<div className="h-6"></div>
		</div>
	)
}

function User({ setIsOpen }: { setIsOpen: (open: boolean) => void }) {
	const { session } = useLoaderData({ from: "__root__" })
	const { avatar, fullName } = getUserInfo(session)
	return (
		<div className="flex flex-col sm:gap-2 2xl:gap-4 m-6 w-5/6 sm:max-w-2xl 2xl:max-w-3xl sm:mx-auto ">
			<div
				className={`gap-4 p-8 py-4 rounded-lg flex flex-col sm:flex-row sm:justify-around bg-accent ring-[1px] ring-foreground/10`}
			>
				<div className="bg-accent flex gap-3 justify-start items-center">
					{avatar ? (
						<img
							src={avatar}
							alt="User avatar"
							className="size-12 sm:size-10 2xl:size-14 rounded-full"
						/>
					) : (
						<div className="bg-green-600 p-2 rounded-full">
							<UserRound />
						</div>
					)}
					<p className="sm:text-base 2xl:text-lg font-semibold tracking-wider text-left">
						{fullName || "Usuario"}
					</p>
				</div>
				<div className="flex items-center justify-between">
					<UserSuscriptionInfo setIsOpen={setIsOpen} />
				</div>
			</div>
			<div className="w-full flex itemx-center justify-between">
				<Theme />
				<LogoutAlertDialog />
			</div>
		</div>
	)
}

function UserSuscriptionInfo({
	setIsOpen,
}: {
	setIsOpen: (open: boolean) => void
}) {
	const { data: credits } = useQuery(userCreditsOptions)
	return (
		<div className="w-full flex flex-col items-end justify-end gap-1">
			<div className="flex justify-end items-center gap-2 w-full">
				<Shield className="size-5 dark:text-amber-300 text-amber-800/80" />
				<span className="font-semibold text-gray-50/50 sm:text-foreground/50 text-sm">
					creditos disponibles: {credits}
				</span>
			</div>
			<Link
				to="/suscripcion"
				search={{
					from: "root",
				}}
				onClick={() => setIsOpen(prev => !prev)}
				className="text:sm sm:text-xs tracking-wider flex items-center justify-end gap-1 bg-primary rounded p-1 px-2"
			>
				Agregar Creditos
			</Link>
		</div>
	)
}

export function LogoutAlertDialog() {
	const [open, setOpen] = useState(false)
	const navigate = useNavigate()
	const { session } = useLoaderData({ from: "__root__" })
	const isDemo = !!(
		session?.user.email?.startsWith(DEMO_EMAIL_PREFIX) &&
		session?.user.email?.endsWith(DEMO_EMAIL_DOMAIN)
	)
	const [resetting, setResetting] = useState(false)

	const logout = async () => {
		if (isDemo) {
			setResetting(true)
			try {
				await resetDemoData()
			} catch (_err) {
				// si falla el reset, igual cerramos sesión
			}
		}
		await authClient.signOut({
			fetchOptions: {
				onSuccess: () => {
					navigate({ to: "/login" })
				},
			},
		})
	}

	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogTrigger asChild className="m-4 hover:bg-accent">
				<button
					type="button"
					className="flex p-2 rounded-sm cursor-pointer items-center justify-end sm:justify-start gap-2 text-left"
				>
					<LogOut
						size={16}
						className="text-foreground/90 sm:text-foreground/80"
					/>{" "}
					Cerrar sesion
				</button>
			</AlertDialogTrigger>
			<AlertDialogContent className="backdrop-blur-xl w-11/12 flex flex-col gap-4 py-20 justify-center items-center px-2">
				<AlertDialogTitle className="text-center sm:text-lg 2xl:text-xl">
					{isDemo
						? "¿Cerrar sesión? Se eliminarán los datos de la demo."
						: "¿Estás seguro de que quieres cerrar sesión?"}
				</AlertDialogTitle>
				<AlertDialogDescription className="text-center w-3/4 text-pretty mx-auto">
					{isDemo
						? "Todos los reportes y datos creados en esta sesión demo serán eliminados."
						: "Esto cerrará tu sesión y necesitarás iniciar sesión de nuevo."}
				</AlertDialogDescription>
				<div className="flex items-center justify-center gap-4 w-11/12">
					<Button
						variant={"outline"}
						className="cursor-pointer w-1/2"
						disabled={resetting}
						onClick={() => {
							setOpen(false)
						}}
					>
						Cancelar
					</Button>
					<Button
						className="cursor-pointer w-1/2"
						onClick={logout}
						disabled={resetting}
					>
						{resetting ? "Limpiando..." : "Confirmar"}
					</Button>
				</div>
			</AlertDialogContent>
		</AlertDialog>
	)
}
