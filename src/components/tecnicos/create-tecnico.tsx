import { useForm } from "@tanstack/react-form"
import { Asterisk, CircleAlert, Loader } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "@tanstack/react-router"
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
	AlertDialog,
	AlertDialogTrigger,
	AlertDialogContent,
	AlertDialogTitle,
	AlertDialogDescription,
} from "@/components/ui/alert-dialog"
import { useCreateTecnico } from "../../../queries/tecnico/use-create-tecnico"
import {
	defaultTecnico,
	tecnicoFormValidator,
} from "../../../db/tecnicos/tecnico-validator"
import { Button } from "../ui/button"
import Title from "../title"
import { FileDropzone } from "../upload-button"

export default function CreateTecnico() {
	const [open, setOpen] = useState(false)

	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogTrigger asChild className="hover:bg-accent">
				<Button className="w-1/2 mx-auto py-5">Cargar datos</Button>
			</AlertDialogTrigger>
			<AlertDialogContent className="bg-background sm:px-20 py-15 sm:py-6 w-full sm:w-1/2 h-screen sm:h-[95dvh] overflow-auto border-none rounded-none max-w-screen">
				<AlertDialogTitle>
					<Title text="Tecnico Datos" className="mt-0" />
				</AlertDialogTitle>
				<AlertDialogDescription asChild>
					<div className="text-center">
						<CreateTecnicoForm setOpen={setOpen} />
					</div>
				</AlertDialogDescription>
			</AlertDialogContent>
		</AlertDialog>
	)
}

export function CreateTecnicoForm({
	setOpen,
}: {
	setOpen: (open: boolean) => void
}) {
	const [matriculaFile, setMatriculaFile] = useState<string>("")
	const [firmaFile, setFirmaFile] = useState<string>("")
	const navigate = useNavigate()

	const {
		mutateAsync: createTecnicoMutation,
		isPending,
		error,
	} = useCreateTecnico()

	const form = useForm({
		defaultValues: defaultTecnico,
		validators: {
			onSubmit: tecnicoFormValidator,
		},
		onSubmit: async ({ value }) => {
			const newTecnico = {
				...value,
				firmaImg: firmaFile,
				matriculaImg: matriculaFile,
			}
			const result = await createTecnicoMutation({ data: newTecnico })
			if (!result) {
				console.error("Error al crear el técnico", error)
				return
			}
			setOpen(false)
			console.log("Técnico creado exitosamente")
			navigate({ to: "/perfil/tecnicos" })
		},
	})

	return (
		<form
			className="flex flex-col gap-4"
			id="create-form"
			onSubmit={e => {
				e.preventDefault()
				form.handleSubmit()
			}}
		>
			<FieldGroup className="gap-5">
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-7 sm:gap-y-4 sm:gap-x-10 justify-center items-start w-5/6 sm:w-full mx-auto mb-3 sm:mb-0">
					<form.Field
						name="nombre"
						children={field => {
							const isInvalid =
								field.state.meta.isTouched && !field.state.meta.isValid
							return (
								<Field data-invalid={isInvalid} className="relative gap-1">
									<FieldLabel htmlFor={field.name}>
										Nombre completo
										<Asterisk className="text-destructive size-3" />
									</FieldLabel>
									<Input
										id={field.name}
										name={field.name}
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={e => field.handleChange(e.target.value)}
										aria-invalid={isInvalid}
										placeholder="Nombre Completo"
										className="bg-background sm:bg-accent text-right"
									/>
									{isInvalid && (
										<FieldError
											errors={field.state.meta.errors}
											className="text-xs 2xl:text-sm absolute -bottom-4 left-0"
										/>
									)}
								</Field>
							)
						}}
					/>

					<form.Field
						name="telefono"
						children={field => {
							const isInvalid =
								field.state.meta.isTouched && !field.state.meta.isValid
							return (
								<Field data-invalid={isInvalid} className="relative gap-1">
									<FieldLabel htmlFor={field.name}>Telefono</FieldLabel>
									<Input
										id={field.name}
										name={field.name}
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={e => field.handleChange(e.target.value)}
										aria-invalid={isInvalid}
										placeholder="000-0000000"
										className="bg-background sm:bg-accent text-right"
									/>
									{isInvalid && (
										<FieldError
											errors={field.state.meta.errors}
											className="text-xs 2xl:text-sm absolute -bottom-4 left-0"
										/>
									)}
								</Field>
							)
						}}
					/>

					<form.Field
						name="cargo"
						children={field => {
							const isInvalid =
								field.state.meta.isTouched && !field.state.meta.isValid
							return (
								<Field data-invalid={isInvalid} className="relative gap-1">
									<FieldLabel htmlFor={field.name}>
										Cargo
										<Asterisk className="text-destructive size-3" />
									</FieldLabel>
									<Input
										id={field.name}
										name={field.name}
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={e => field.handleChange(e.target.value)}
										aria-invalid={isInvalid}
										placeholder="Ej. Seguridad e Higiene"
										className="bg-background sm:bg-accent text-right"
									/>
									{isInvalid && (
										<FieldError
											errors={field.state.meta.errors}
											className="text-xs 2xl:text-sm absolute -bottom-4 left-0"
										/>
									)}
								</Field>
							)
						}}
					/>

					<form.Field
						name="localidad"
						children={field => {
							const isInvalid =
								field.state.meta.isTouched && !field.state.meta.isValid
							return (
								<Field data-invalid={isInvalid} className="relative gap-1">
									<FieldLabel htmlFor={field.name}>Localidad </FieldLabel>
									<Input
										id={field.name}
										name={field.name}
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={e => field.handleChange(e.target.value)}
										aria-invalid={isInvalid}
										placeholder="Ej. Andorra"
										className="bg-background sm:bg-accent text-right"
									/>
									{isInvalid && (
										<FieldError
											errors={field.state.meta.errors}
											className="text-xs 2xl:text-sm absolute -bottom-4 left-0"
										/>
									)}
								</Field>
							)
						}}
					/>

					<form.Field
						name="matricula"
						children={field => {
							const isInvalid =
								field.state.meta.isTouched && !field.state.meta.isValid
							return (
								<Field data-invalid={isInvalid} className="relative gap-1">
									<FieldLabel htmlFor={field.name}>
										Matrícula
										<Asterisk className="text-destructive size-3" />
									</FieldLabel>
									<Input
										id={field.name}
										name={field.name}
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={e => field.handleChange(e.target.value)}
										aria-invalid={isInvalid}
										placeholder="N° Matrícula"
										className="bg-background sm:bg-accent text-right"
									/>
									{isInvalid && (
										<FieldError
											errors={field.state.meta.errors}
											className="text-xs 2xl:text-sm absolute -bottom-4 left-0"
										/>
									)}
								</Field>
							)
						}}
					/>
					<div className="flex flex-col gap-1">
						<Label>Matrícula Digital</Label>
						<FileDropzone
							text="Imágen Matrícula"
							onUploaded={url => {
								// console.log("URL matricula", url)
								if (url.length > 0 && url !== matriculaFile) {
									setMatriculaFile(url)
								} else setMatriculaFile("")
							}}
						/>
					</div>

					<div className="flex-1 flex flex-col gap-1">
						<Label>Firma Digital</Label>
						<FileDropzone
							text="Imágen Firma"
							onUploaded={url => {
								// console.log("URL", url)
								if (url.length > 0 && url !== firmaFile) {
									setFirmaFile(url)
								} else setFirmaFile("")
							}}
						/>
					</div>
				</div>

				<div className="flex flex-col gap-10 w-5/6 mx-auto">
					<div className="flex justify-end items-center gap-2 w-full text-destructive">
						<Asterisk className="text-destructive size-3" />
						<span className="text-xs 2xl:text-sm italic tracking-wide">
							campo obligatorio
						</span>
					</div>

					<div className="flex items-center gap-2">
						<CircleAlert className="size-3 sm:size-4 text-amber-500/50" />
						<span className="text-xs sm:text-sm italic text-foreground/25">
							Completa tus datos para los reportes.
						</span>
					</div>

					<Field className="flex flex-col justify-center gap-4 items-center w-full mt-10">
						<Button
							variant="outline"
							onClick={() => setOpen(false)}
							type="button"
							disabled={isPending}
							className="flex-1 py-4"
						>
							Cancelar
						</Button>
						<Button type="submit" disabled={isPending} className="flex-1 py-4">
							{isPending ? (
								<div className="flex gap-2 w-full justify-center items-center">
									Guardando... <Loader className="animate-spin size-4"></Loader>
								</div>
							) : (
								"Guardar"
							)}
						</Button>
					</Field>
				</div>

				{error && <p>{error.message}</p>}
			</FieldGroup>
		</form>
	)
}
