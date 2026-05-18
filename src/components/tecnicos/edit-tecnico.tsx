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
import { Button } from "../ui/button"
import Title from "../title"
import { FileDropzone } from "../upload-button"

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
				<Button className="w-40 p-5">
					<Pencil size={14} className="text-foreground/70" />
					Editar
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent className="sm:px-20 py-15 sm:py-6 w-full h-screen sm:h-[95dvh] overflow-auto border-none rounded-none max-w-screen">
				<AlertDialogTitle>
					<Title text="Editar Técnico" />
				</AlertDialogTitle>
				<AlertDialogDescription asChild>
					<div className="text-center">
						<EditTecnicoForm
							tecnico={tecnico}
							setOpen={setOpen}
							setIsMenuOpen={setIsMenuOpen}
						/>
					</div>
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
	const [matriculaFile, setMatriculaFile] = useState<string>(
		tecnico.matriculaImg ?? ""
	)
	const [firmaFile, setFirmaFile] = useState<string>(tecnico.firmaImg ?? "")
	const [empresaLogoFile, setEmpresaLogoFile] = useState<string>(
		tecnico.empresaLogo ?? ""
	)

	const {
		mutateAsync: editTecnicoMutation,
		isPending,
		error,
	} = useUpdateTecnico()

	const form = useForm({
		defaultValues: { ...tecnico },
		validators: {
			onSubmit: updateTecnicoValidator,
		},
		onSubmit: async ({ value }) => {
			const newTecnico = {
				...value,
				firmaImg: firmaFile,
				matriculaImg: matriculaFile,
				empresaLogo: empresaLogoFile,
			}
			if (checkTecnicoDiference(newTecnico, tecnico)) {
				setOpen(false)
				return
			}
			const result = await editTecnicoMutation({ data: newTecnico })
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
											onFocus={e => e.target.select()}
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
											onFocus={e => e.target.select()}
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
											onFocus={e => e.target.select()}
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
											onFocus={e => e.target.select()}
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
											onFocus={e => e.target.select()}
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
								defaultValue={tecnico.matriculaImg}
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
							<div className={`${firmaFile ? "bg-white/75" : ""}`}>
								<FileDropzone
									text="Imágen Firma"
									defaultValue={tecnico.firmaImg}
									onUploaded={url => {
										// console.log("URL", url)
										if (url.length > 0 && url !== firmaFile) {
											setFirmaFile(url)
										} else setFirmaFile("")
									}}
								/>
							</div>
						</div>

						<div className="flex-1 flex flex-col gap-1">
							<Label>Empresa Logo</Label>
							<div className={`${empresaLogoFile ? "bg-white/75" : ""}`}>
								<FileDropzone
									text="Imágen Empresa Logo"
									defaultValue={tecnico.empresaLogo}
									onUploaded={url => {
										// console.log("URL", url)
										if (url.length > 0 && url !== empresaLogoFile) {
											setEmpresaLogoFile(url)
										} else setEmpresaLogoFile("")
									}}
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

					<Field className="flex flex-col justify-center gap-4 sm:flex-row items-center w-full mt-10">
						<Button
							variant="outline"
							onClick={() => {
								setOpen(false)
								if (setIsMenuOpen) setIsMenuOpen(false)
							}}
							type="button"
							disabled={isPending}
							className="flex-1 py-4"
						>
							Cancelar
						</Button>
						<Button type="submit" disabled={isPending} className="flex-1 py-4">
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
