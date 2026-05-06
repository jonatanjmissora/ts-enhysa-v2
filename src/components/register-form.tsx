import { useForm } from "@tanstack/react-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
	FieldSeparator,
} from "@/components/ui/field"
import { cn } from "@/lib/utils"
import { useRouter } from "@tanstack/react-router"
import { authClient } from "@/lib/auth-client"
import { useState } from "react"
import { Eye, EyeClosed } from "lucide-react"
// import { PreferencesMenu } from "./layout/preferences-menu"
import { Input } from "./ui/input"

const formSchema = z.object({
	nombre: z.string().min(3, "Nombre mínimo de 3 caracteres."),
	email: z.email("Email inválido"),
	password: z.string().min(8, "Contraseña mínima de 8 caracteres."),
})

export function RegisterForm({
	className,
	setActiveForm,
	...props
}: React.ComponentProps<"div"> & {
	setActiveForm: (form: "login" | "register") => void
}) {
	const router = useRouter()
	const [loading, setLoading] = useState(false)
	const [showPassword, setShowPassword] = useState(false)

	const form = useForm({
		defaultValues: {
			nombre: "",
			email: "",
			password: "",
		},
		validators: {
			onSubmit: formSchema,
		},
		onSubmit: async ({ value }) => {
			await authClient.signUp.email(
				{
					email: value.email,
					password: value.password,
					name: value.nombre,
					callbackURL: "/",
				},
				{
					onSuccess: () => {
						console.log("Registro exitoso")
						router.navigate({ to: "/" })
					},
					onError: ctx => {
						console.error(ctx.error.message)
					},
				}
			)
		},
	})

	const signIn = async () => {
		setLoading(true)

		try {
			await authClient.signIn.social({
				provider: "google",
				callbackURL: "/",
			})
		} catch (_err) {
			// error ANTES de redirigir
			setLoading(false)
			console.error("No se pudo iniciar sesión con Google")
		}
	}

	return (
		<div className={cn("w-90 relative sm:mr-50", className)} {...props}>
			{/*<div className="absolute top-4 left-4 right-4">
				 <PreferencesMenu /> 
			</div>*/}
			<div className="w-11/12 mx-auto">
				<CardHeader className="text-center">
					<div className="w-full sm:hidden flex flex-col items-center pb-4 relative">
						<img
							src="/EnHySa_logo.webp"
							alt="logo EnHySa"
							className="size-40"
						/>

						<p className="absolute bottom-3 left-1/2 -translate-x-1/2 textXL text-3xl dark:text-shadow-lg/50 w-full">
							EnHySa App
						</p>
					</div>
					<CardTitle className="hidden sm:block text-xl dark:text-shadow-lg/50">
						Bienvenido a la app
					</CardTitle>
					<CardDescription className="hidden sm:block text-foreground/75">
						Ingresa con una cuenta de Google
					</CardDescription>
				</CardHeader>
				<CardContent className="p-0 sm:px-4">
					<form
						id="register-form"
						onSubmit={e => {
							e.preventDefault()
							form.handleSubmit()
						}}
					>
						<FieldGroup>
							<Field>
								<Button
									variant="outline"
									type="button"
									onClick={signIn}
									className="my-shadow"
								>
									{loading ? (
										"Iniciando..."
									) : (
										<div className="flex items-center gap-2">
											<img
												src="/google-icon-logo.svg"
												alt="Google"
												className="h-5"
											/>{" "}
											Google
										</div>
									)}
								</Button>
							</Field>
							<FieldSeparator className="hidden sm:block">
								<span className="text-foreground/75 bg-accent">
									O continua con
								</span>
							</FieldSeparator>

							<form.Field
								name="nombre"
								children={field => {
									const isInvalid =
										field.state.meta.isTouched && !field.state.meta.isValid
									return (
										<Field data-invalid={isInvalid}>
											<FieldLabel
												htmlFor={field.name}
												className="dark:text-shadow-sm/50"
											>
												Nombre
											</FieldLabel>
											<Input
												id={field.name}
												name={field.name}
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={e => field.handleChange(e.target.value)}
												aria-invalid={isInvalid}
												placeholder="nombre apellido"
												autoComplete="off"
											/>
											{isInvalid && (
												<FieldError errors={field.state.meta.errors} />
											)}
										</Field>
									)
								}}
							/>

							<form.Field
								name="email"
								children={field => {
									const isInvalid =
										field.state.meta.isTouched && !field.state.meta.isValid
									return (
										<Field data-invalid={isInvalid}>
											<FieldLabel
												htmlFor={field.name}
												className="dark:text-shadow-sm/50"
											>
												Email
											</FieldLabel>
											<Input
												id={field.name}
												name={field.name}
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={e => field.handleChange(e.target.value)}
												aria-invalid={isInvalid}
												placeholder="m@example.com"
												autoComplete="off"
											/>
											{isInvalid && (
												<FieldError errors={field.state.meta.errors} />
											)}
										</Field>
									)
								}}
							/>

							<form.Field
								name="password"
								children={field => {
									const isInvalid =
										field.state.meta.isTouched && !field.state.meta.isValid
									return (
										<Field data-invalid={isInvalid}>
											<FieldLabel
												htmlFor={field.name}
												className="dark:text-shadow-sm/50"
											>
												Contraseña
											</FieldLabel>
											<div className="relative">
												<Input
													id={field.name}
													name={field.name}
													value={field.state.value}
													onBlur={field.handleBlur}
													onChange={e => field.handleChange(e.target.value)}
													aria-invalid={isInvalid}
													placeholder="********"
													type={showPassword ? "text" : "password"}
												/>
												<button
													type="button"
													onClick={() => setShowPassword(!showPassword)}
													className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer  my-shadow"
												>
													{showPassword ? (
														<EyeClosed size={16} />
													) : (
														<Eye size={16} />
													)}
												</button>
											</div>
											{isInvalid && (
												<FieldError errors={field.state.meta.errors} />
											)}
										</Field>
									)
								}}
							/>

							<Field>
								<button
									type="submit"
									className="themeBtnAccent tracking-wider font-semibold  my-shadow cursor-pointer rounded-xl py-2 dark:text-shadow-sm/50 ring ring-green-500/30"
								>
									Registrar
								</button>
								<FieldDescription className="text-center">
									Ya tienes cuenta ?{" "}
									<button
										type="button"
										onClick={() => setActiveForm("login")}
										// viewTransition={{ types: ["rotateZ"] }}
										className="cursor-pointer dark:hover:text-green-400 underline dark:text-shadow-sm/50 my-shadow"
									>
										Ingresar
									</button>
								</FieldDescription>
							</Field>
						</FieldGroup>
					</form>
				</CardContent>
			</div>
		</div>
	)
}
