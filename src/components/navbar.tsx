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
import { Theme } from "./theme"

export default function Navbar() {
	const [isOpen, setIsOpen] = useState(false)
	return (
		<header
			className={`w-full relative h-18 flex items-center justify-between p-4 text-foreground`}
		>
			<Link to="/" className="flex items-center gap-3">
				<img src="/EnHySa_logo.webp" alt="logo EnHySa" className="size-10" />

				<p className="textXL">EnHySa App</p>
			</Link>
			{/* <div className="block sm:hidden"> */}
				<button onClick={() => setIsOpen(!isOpen)}>
					<Menu className="size-7" />
				</button>
				<MovilMenuContent isOpen={isOpen} setIsOpen={setIsOpen} />
			{/* </div> */}
				{/* <ul className="sm:flex hidden flex-1 justify-end gap-40 items-center">
					<Link
						to="/"
						resetScroll={true}
					>
						Inicio
					</Link>
					<Link
						to="/perfil/tecnicos"
						resetScroll={true}
					>
						Mi Perfil
					</Link>
					<Link
						to="/suscripcion"
						resetScroll={true}
					>
						Suscripción
					</Link>
				</ul> */}
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
				<button onClick={() => setIsOpen(!isOpen)}>
					<X className="size-7" />
				</button>
			</div>

			<ul className="flex flex-col gap-5 text-2xl tracking-widest font-semibold flex-1 items-center justify-center w-5/6 sm:max-w-2xl 2xl:max-w-3xl sm:mx-auto ">
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
		<div className="flex flex-col sm:gap-2 2xl:gap-4 m-6 w-5/6 sm:max-w-2xl 2xl:max-w-3xl sm:mx-auto ">
			<div
				className={`gap-4 p-8 py-4 rounded-lg flex bg-accent ring-[1px] ring-foreground/10`}
			>
				<div className="bg-accent rounded-full flex justify-center items-center">
					{avatar ? (
						<img
							src={avatar}
							alt="User avatar"
							className="sm:size-10 2xl:size-14 rounded-full"
						/>
					) : (
						<div className="bg-accent p-2 rounded-full">
							{fullName?.charAt(0).toUpperCase()}
						</div>
					)}
				</div>
				<div className="flex flex-col items-end w-full">
					<p className="sm:text-base 2xl:text-lg font-semibold tracking-wider text-left w-full">
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
			<div className="w-full flex itemx-center justify-between">
				<Theme />
				<LogoutAlertDialog />
			</div>
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
					<LogOut
						size={16}
						className="text-foreground/90 sm:text-foreground/80"
					/>{" "}
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
