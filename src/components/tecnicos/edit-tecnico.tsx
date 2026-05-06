import { useState } from "react"
import { useForm } from "@tanstack/react-form"
import { Asterisk, CircleAlert, Loader, Pencil } from "lucide-react"
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { checkTecnicoDiference } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import {
	AlertDialog,
	AlertDialogTrigger,
	AlertDialogContent,
	AlertDialogTitle,
	AlertDialogDescription,
} from "@/components/ui/alert-dialog"
import type { TecnicoType } from "../../../db/tecnicos/schema"
import { useUpdateTecnico } from "../../../queries/tecnico/use-update-tecnico"
import { updateTecnicoValidator } from "../../../db/tecnicos/tecnico-validator"
import { InputFiles } from "../input-files"
import { Button } from "../ui/button"
import Title from "../title"

export default function EditTecnico({
	tecnico,
	setIsMenuOpen,
}: {
	tecnico: TecnicoType
	setIsMenuOpen?: (open: boolean) => void
}) {
	const [open, setOpen] = useState(false)
	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogTrigger asChild>
				<div className="w-5/6 mx-auto flex justify-end">
					<Button variant="secondary" className="w-1/2">
						<Pencil size={14} className="text-foreground/70" />
						Editar
					</Button>
					<div className="sm:block hidden my-10 w-1/4 ml-auto">
						<button className="card bg-background sm:bg-accent rounded-lg cursor-pointer textM text-sm sm:text-base py-2 w-full justify-center gap-4 ml-auto">
							<Pencil className="size-6 text-foreground/70" />
							Editar
						</button>
					</div>
				</div>
			</AlertDialogTrigger>
			<AlertDialogContent className="p-6 sm:px-20 py-15 sm:py-6 bg-accent/80 backdrop-blur-xl w-full sm:w-1/2 h-screen sm:h-[95dvh] overflow-auto">
				<AlertDialogTitle>
					<Title text="Editar Técnico" />
				</AlertDialogTitle>
				<AlertDialogDescription className="text-center">
					<EditTecnicoForm
						tecnico={tecnico}
						setOpen={setOpen}
						setIsMenuOpen={setIsMenuOpen}
					/>
				</AlertDialogDescription>
			</AlertDialogContent>
		</AlertDialog>
	)
}

export function EditTecnicoForm({
	tecnico,
	setOpen,
	setIsMenuOpen,
}: {
	tecnico: TecnicoType
	setOpen: (open: boolean) => void
	setIsMenuOpen?: (open: boolean) => void
}) {
	const [matriculaFiles, setMatriculaFiles] = useState<File[]>([])
	const [firmaFiles, setFirmaFiles] = useState<File[]>([])

	const {
		mutateAsync: editTecnicoMutation,
		isPending,
		error,
	} = useUpdateTecnico()

	const form = useForm({
		defaultValues: {
			id: tecnico.id,
			nombre: tecnico.nombre,
			telefono: tecnico.telefono,
			localidad: tecnico.localidad,
			cargo: tecnico.cargo,
			matricula: tecnico.matricula,
			matriculaImg: tecnico.matriculaImg,
			firmaImg: tecnico.firmaImg,
			membrete: tecnico.membrete,
			userId: tecnico.userId,
		},
		validators: {
			onSubmit: updateTecnicoValidator,
		},
		onSubmit: async ({ value }) => {
			if (checkTecnicoDiference(value, tecnico)) {
				setOpen(false)
				return
			}
			const result = await editTecnicoMutation({ data: value })
			if (!result) {
				console.error("Error al editar técnico", error)
			}
			if (setIsMenuOpen) setIsMenuOpen(false)
			setOpen(false)
			console.log("Técnico editado exitosamente")
		},
	})

	return (
		<article className="grid grid-cols-1 gap-7 sm:gap-y-4 sm:gap-x-10 justify-center items-center w-5/6 sm:w-full mx-auto">
			<form
				className="flex items-center justify-center flex-col w-full"
				id="create-form"
				onSubmit={e => {
					e.preventDefault()
					form.handleSubmit()
				}}
			>
				<FieldGroup className="gap-5">
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-7 sm:gap-y-4 sm:gap-x-10 justify-center items-start w-full mx-auto mb-3 sm:mb-0">
						<form.Field
							name="nombre"
							children={field => {
								const isInvalid =
									field.state.meta.isTouched && !field.state.meta.isValid
								return (
									<Field data-invalid={isInvalid} className="relative gap-1">
										<FieldLabel htmlFor={field.name}>
											Nombre Completo
											<Asterisk className="text-destructive size-3" />
										</FieldLabel>
										<Input
											id={field.name}
											name={field.name}
											value={field.state.value.toUpperCase()}
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
											value={field.state.value.toUpperCase()}
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
											value={field.state.value.toUpperCase()}
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
							<div className="card p-2 bg-background sm:bg-accent text-sm">
								<InputFiles
									files={matriculaFiles}
									setFiles={setMatriculaFiles}
									text="Imágen matrícula"
									maxFiles={1}
									editMode={true}
								/>
							</div>
						</div>

						<div className="flex-1 flex flex-col gap-1">
							<Label>Firma Digital</Label>
							<div className="card p-2 bg-background sm:bg-accent text-sm h-full">
								<InputFiles
									files={firmaFiles}
									setFiles={setFirmaFiles}
									text="Imágen Firma Digital"
									maxFiles={1}
									editMode={true}
								/>
							</div>
						</div>

						<div className="flex-1 flex flex-col gap-1">
							<Label>Pie de Página</Label>
							<div className="flex flex-col gap-[0.5px]">
								<Input
									value={tecnico.nombre?.toUpperCase() || ""}
									placeholder="Nombre Completo..."
									readOnly
									className="bg-background sm:bg-accent text-center"
								/>

								<Input
									value={`MAT ${tecnico.matricula?.toUpperCase()}` || ""}
									placeholder="Matricula..."
									readOnly
									className="bg-background sm:bg-accent text-center"
								/>
							</div>
						</div>
					</div>

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

					<Field className="flex flex-row justify-center gap-2 sm:gap-10 items-center w-full mt-10">
						<Button
							variant="outline"
							onClick={() => {
								setOpen(false)
								if (setIsMenuOpen) setIsMenuOpen(false)
							}}
							type="button"
							disabled={isPending}
							className="flex-1"
						>
							Cancelar
						</Button>
						<Button
							variant="secondary"
							type="submit"
							disabled={isPending}
							className="flex-1"
						>
							{isPending ? (
								<div className="flex gap-2 w-full justify-center">
									Editando... <Loader className="animate-spin size-4"></Loader>
								</div>
							) : (
								"Guardar"
							)}
						</Button>
					</Field>

					{error && <p>{error.message}</p>}
				</FieldGroup>
			</form>
		</article>
	)
}
