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
import { useState } from "react"
import { authClient } from "@/lib/auth-client"
import { ensureDemoUser } from "../../server/seed-demo-user-server"
import { Eye, EyeClosed } from "lucide-react"
// import { PreferencesMenu } from "./layout/preferences-menu"
import { Input } from "./ui/input"
import { DemoCredentialsModal } from "./demo-credentials-modal"

const formSchema = z.object({
	email: z.email("Email inválido"),
	password: z.string().min(5, "Contraseña mínima de 5 caracteres."),
})

export function LoginForm({
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
			email: "",
			password: "",
		},
		validators: {
			onSubmit: formSchema,
		},
		onSubmit: async ({ value }) => {
			const result = await authClient.signIn.email({
				email: value.email,
				password: value.password,
				callbackURL: "/",
			})
			if (result.error) {
				console.error("Email o contraseña incorrectos")
				return
			}

			console.log("Login exitoso")
			router.invalidate()
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
		<div className={cn("w-90 relative", className)} {...props}>
			<div className="w-11/12 mx-auto">
				<CardHeader className="text-center">
					<CardTitle className="hidden sm:block text-xl">
						Bienvenido de nuevo
					</CardTitle>
					<CardDescription className="hidden sm:block text-foreground/75">
						Ingresa con una cuenta
					</CardDescription>
				</CardHeader>
				<CardContent className="p-0 sm:px-4">
					<form
						id="login-form"
						onSubmit={e => {
							e.preventDefault()
							form.handleSubmit()
						}}
					>
						<FieldGroup className="gap-5">
							<Field>
								<Button variant="outline" type="button" onClick={signIn}>
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
							<DemoButton />
							<FieldSeparator className="hidden sm:block">
								<span className="text-foreground/75 bg-accent">
									O continua con
								</span>
							</FieldSeparator>

							<form.Field
								name="email"
								children={field => {
									const isInvalid =
										field.state.meta.isTouched && !field.state.meta.isValid
									return (
										<Field data-invalid={isInvalid} className="gap-0">
											<FieldLabel htmlFor={field.name}>Email</FieldLabel>
											<Input
												onFocus={e => e.target.select()}
												id={field.name}
												name={field.name}
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={e => field.handleChange(e.target.value)}
												aria-invalid={isInvalid}
												placeholder="m@example.com"
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
										<Field data-invalid={isInvalid} className="gap-0">
											<FieldLabel htmlFor={field.name}>Contraseña</FieldLabel>
											<div className="relative">
												<Input
													onFocus={e => e.target.select()}
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
													aria-label={
														showPassword
															? "Ocultar contraseña"
															: "Mostrar contraseña"
													}
													className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
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
								<Button
									type="submit"
									className="p-5 text-center ring-foreground/20"
								>
									Ingresar
								</Button>
								<FieldDescription className="text-center">
									No tiene cuenta ?{" "}
									<button
										onClick={() => setActiveForm("register")}
										// viewTransition={{ types: ["rotateZ"] }}
										className="underline"
										type="button"
									>
										Registrate
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

function DemoButton() {
	const [loading, setLoading] = useState(false)
	const [demoCreds, setDemoCreds] = useState<{
		email: string
		password: string
	} | null>(null)

	const handleDemo = async () => {
		setLoading(true)
		try {
			const creds = await ensureDemoUser()
			setDemoCreds(creds)
		} catch (_err) {
			setLoading(false)
		}
	}

	const confirmDemo = async () => {
		if (!demoCreds) return
		await authClient.signIn.email({
			email: demoCreds.email,
			password: demoCreds.password,
			callbackURL: "/",
		})
	}

	return (
		<>
			{demoCreds && (
				<DemoCredentialsModal
					email={demoCreds.email}
					password={demoCreds.password}
					onConfirm={confirmDemo}
				/>
			)}
			<Field>
				<Button
					type="button"
					onClick={handleDemo}
					disabled={loading}
					className="bg-green-600 hover:bg-green-500"
				>
					{loading ? "Iniciando..." : "Demo — Probar sin registrarse"}
				</Button>
			</Field>
		</>
	)
}
