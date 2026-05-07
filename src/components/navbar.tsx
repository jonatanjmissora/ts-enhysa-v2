import { Menu, X } from "lucide-react"
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

export default function Navbar() {
	const [isOpen, setIsOpen] = useState(false)
	return (
		<header
			className={`w-full relative h-18 flex items-center justify-between p-4 text-gray-50`}
		>
			<Link to="/" className="flex items-center gap-3">
				<img
					src="/EnHySa_logo.webp"
					alt="logo EnHySa"
					className="size-10 drop-shadow-sm/90"
				/>

				<p className="textXL text-shadow-lg/50">EnHySa App</p>
			</Link>
			<button onClick={() => setIsOpen(!isOpen)}>
				<Menu className="size-7 drop-shadow-md/90" />
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
			className={` flex flex-col justify-between items-center fixed z-10 inset-0 bg-background w-screen h-svh  ${isOpen ? "translate-y-0" : "-translate-y-full"} transition-transform duration-500 text-gray-50`}
		>
			<div className="h-25 w-full flex items-center justify-end p-8">
				<button onClick={() => setIsOpen(!isOpen)}>
					<X className="size-7 drop-shadow-md/90" />
				</button>
			</div>

			<ul className="flex flex-col gap-5 text-2xl tracking-widest font-semibold flex-1 items-center justify-center text-shadow-lg/50 w-5/6">
				<Link
					to="/"
					onClick={() => setIsOpen(!isOpen)}
					resetScroll={true}
					className="w-full py-2 text-center"
				>
					Inicio
				</Link>
				<Link
					to="/perfil/tecnicos"
					onClick={() => setIsOpen(!isOpen)}
					resetScroll={true}
					className="w-full py-2 text-center"
				>
					Mi Perfil
				</Link>
				<Link
					to="/suscripcion"
					onClick={() => setIsOpen(!isOpen)}
					resetScroll={true}
					className="w-full py-2 text-center"
				>
					Suscripción
				</Link>
			</ul>
			<User />
			<div className="h-6"></div>
		</div>
	)
}

function User() {
	const { session } = useLoaderData({ from: "__root__" })
	const { avatar, fullName } = getUserInfo(session)
	return (
		<div className="flex flex-col sm:gap-2 2xl:gap-4 m-6 w-5/6">
			<div
				className={`gap-4 p-8 py-4 rounded-lg flex bg-gray-900/50 sm:bg-background sm:ring-foreground/5`}
			>
				<div className="bg-accent rounded-full flex justify-center items-center">
					{avatar ? (
						<img
							src={avatar}
							alt="User avatar"
							className="sm:size-10 2xl:size-14 rounded-full drop-shadow-lg/50"
						/>
					) : (
						<div className="bg-accent p-2 rounded-full">
							{fullName?.charAt(0).toUpperCase()}
						</div>
					)}
				</div>
				<div className="flex flex-col items-end w-full">
					<p className="sm:text-base 2xl:text-lg font-semibold tracking-wider text-left w-full sm:text-shadow-none text-shadow-sm/50 dark:text-shadow-sm/50 ">
						{fullName || "Usuario"}
					</p>
					<Link
						to="/suscripcion"
						className="sm:text-sm 2xl:text-base tracking-wider w-full flex items-end justify-end gap-1"
					>
						<Shield className="size-5 dark:text-amber-500/50 text-amber-700/70" />
						<span className="font-semibold text-gray-50/50 sm:text-foreground/50">
							Plan Profesional
						</span>
					</Link>
				</div>
			</div>
			<LogoutAlertDialog />
		</div>
	)
}

export function LogoutAlertDialog() {
	const [open, setOpen] = useState(false)
	const navigate = useNavigate()
	const logout = async () => {
		await authClient.signOut({
			fetchOptions: {
				onSuccess: () => {
					// Redirect to home page after successful logout
					navigate({ to: "/login" })
				},
			},
		})
	}

	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogTrigger asChild className="m-4 hover:bg-accent">
				<span className="flex p-2 rounded-sm cursor-pointer items-center justify-end sm:justify-start gap-2 text-left">
					<LogOut size={16} className="text-gray-50/50 sm:text-foreground/80" />{" "}
					Cerrar sesion
				</span>
			</AlertDialogTrigger>
			<AlertDialogContent className="backdrop-blur-xl w-11/12 flex flex-col gap-4 py-20 justify-center items-center px-2">
				<AlertDialogTitle className="text-center sm:text-lg 2xl:text-xl">
					¿Estás seguro de que quieres cerrar sesión?
				</AlertDialogTitle>
				<AlertDialogDescription className="text-center w-3/4 text-pretty mx-auto">
					Esto cerrará tu sesión y necesitarás iniciar sesión de nuevo.
				</AlertDialogDescription>
				<div className="flex items-center justify-center gap-4 w-11/12">
					<Button
						variant={"outline"}
						className="cursor-pointer w-1/2"
						onClick={() => {
							setOpen(false)
						}}
					>
						Cancelar
					</Button>
					<Button className="cursor-pointer w-1/2" onClick={logout}>
						Confirmar
					</Button>
				</div>
			</AlertDialogContent>
		</AlertDialog>
	)
}
