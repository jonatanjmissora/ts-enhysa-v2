import { useState } from "react"
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Asterisk, Loader } from "lucide-react"
import { useForm } from "@tanstack/react-form"
import {
	AlertDialog,
	AlertDialogTrigger,
	AlertDialogContent,
	AlertDialogTitle,
	AlertDialogDescription,
} from "@/components/ui/alert-dialog"
import { Pencil } from "lucide-react"
import type { EmpresaType } from "../../../db/empresas/schema"
import { useUpdateEmpresa } from "../../../queries/empresas/use-update-empresa"
import { updateEmpresaValidator } from "../../../db/empresas/empresa-validator"
import { checkEmpresaDiference } from "#/lib/utils"
import { Button } from "../ui/button"
import Title from "../title"
import { FileDropzone } from "../upload-button"

export function EditEmpresa({
	empresa,
	setIsMenuOpen,
}: {
	empresa: EmpresaType
	setIsMenuOpen?: (open: boolean) => void
}) {
	const [open, setOpen] = useState(false)
	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogTrigger asChild>
				<div className="w-full sm:hidden flex items-center gap-2 justify-center p-4">
					<Pencil size={14} className="text-foreground" />
					Editar
				</div>
			</AlertDialogTrigger>
			<AlertDialogContent className="bg-background sm:px-20 py-15 sm:py-6 w-full sm:w-1/2 h-screen sm:h-[95dvh] overflow-auto border-none rounded-none max-w-screen">
				<AlertDialogTitle>
					<Title text="Editar Empresa" />
				</AlertDialogTitle>
				<AlertDialogDescription asChild>
					<div className="text-center">
						<EditEmpresaForm
							empresa={empresa}
							setOpen={setOpen}
							setIsMenuOpen={setIsMenuOpen}
						/>
					</div>
				</AlertDialogDescription>
			</AlertDialogContent>
		</AlertDialog>
	)
}

export function EditEmpresaForm({
	empresa,
	setOpen,
	setIsMenuOpen,
}: {
	empresa: EmpresaType
	setOpen: (open: boolean) => void
	setIsMenuOpen?: (open: boolean) => void
}) {
	const [logoFile, setLogoFile] = useState<string>(empresa.logo ?? "")
	const {
		mutateAsync: updateEmpresaMutation,
		isPending,
		error,
	} = useUpdateEmpresa()

	const form = useForm({
		defaultValues: { ...empresa },
		validators: {
			onSubmit: updateEmpresaValidator,
		},
		onSubmit: async ({ value }) => {
			const newEmpresa = {
				...value,
				logo: logoFile,
			}
			if (checkEmpresaDiference(newEmpresa, empresa)) {
				setOpen(false)
				return
			}

			const updateEmpresa = {
				...newEmpresa,
				id: empresa.id,
				userId: empresa.userId,
			}
			const result = await updateEmpresaMutation({ data: updateEmpresa })
			if (!result) {
				console.error("Error al actualizar la empresa", error)
			}
			if (setIsMenuOpen) setIsMenuOpen(false)
			setOpen(false)
			console.log("Empresa actualizada exitosamente")
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
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-7 sm:gap-y-4 sm:gap-x-10 justify-center items-center w-5/6 sm:w-full mx-auto">
					<form.Field
						name="razonSocial"
						children={field => {
							const isInvalid =
								field.state.meta.isTouched && !field.state.meta.isValid
							return (
								<Field data-invalid={isInvalid} className="relative gap-1">
									<FieldLabel htmlFor={field.name}>
										Razón Social
										<Asterisk className="text-destructive size-3" />
									</FieldLabel>
									<Input
										id={field.name}
										name={field.name}
										value={field.state.value.toUpperCase()}
										onBlur={field.handleBlur}
										onChange={e => field.handleChange(e.target.value)}
										aria-invalid={isInvalid}
										placeholder="Ej. Teléfonica"
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
						name="cuit"
						children={field => {
							const isInvalid =
								field.state.meta.isTouched && !field.state.meta.isValid
							return (
								<Field data-invalid={isInvalid} className="relative gap-1">
									<FieldLabel htmlFor={field.name}>
										CUIT
										<Asterisk className="text-destructive size-3" />
									</FieldLabel>
									<Input
										id={field.name}
										name={field.name}
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={e => field.handleChange(e.target.value)}
										aria-invalid={isInvalid}
										placeholder="Ej. 00-00000000-0"
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
						name="direccion"
						children={field => {
							const isInvalid =
								field.state.meta.isTouched && !field.state.meta.isValid
							return (
								<Field data-invalid={isInvalid} className="relative gap-1">
									<FieldLabel htmlFor={field.name}>Dirección</FieldLabel>
									<Input
										id={field.name}
										name={field.name}
										value={field.state.value.toUpperCase()}
										onBlur={field.handleBlur}
										onChange={e => field.handleChange(e.target.value)}
										aria-invalid={isInvalid}
										placeholder="Ej. Villa Verde"
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
									<FieldLabel htmlFor={field.name}>Localidad</FieldLabel>
									<Input
										id={field.name}
										name={field.name}
										value={field.state.value.toUpperCase()}
										onBlur={field.handleBlur}
										onChange={e => field.handleChange(e.target.value)}
										aria-invalid={isInvalid}
										placeholder="Ej. Andorra"
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
						name="codigoPostal"
						children={field => {
							const isInvalid =
								field.state.meta.isTouched && !field.state.meta.isValid
							return (
								<Field data-invalid={isInvalid} className="relative gap-1">
									<FieldLabel htmlFor={field.name}>Código Postal</FieldLabel>
									<Input
										id={field.name}
										name={field.name}
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={e => field.handleChange(e.target.value)}
										aria-invalid={isInvalid}
										placeholder="Ej. 5000"
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
						name="provincia"
						children={field => {
							const isInvalid =
								field.state.meta.isTouched && !field.state.meta.isValid
							return (
								<Field data-invalid={isInvalid} className="relative gap-1">
									<FieldLabel htmlFor={field.name}>Provincia</FieldLabel>
									<Input
										id={field.name}
										name={field.name}
										value={field.state.value.toUpperCase()}
										onBlur={field.handleBlur}
										onChange={e => field.handleChange(e.target.value)}
										aria-invalid={isInvalid}
										placeholder="Ej. Pr. Andorra"
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
						name="horarios"
						children={field => {
							const isInvalid =
								field.state.meta.isTouched && !field.state.meta.isValid
							return (
								<Field data-invalid={isInvalid} className="relative gap-1">
									<FieldLabel htmlFor={field.name}>
										Horarios de trabajo
									</FieldLabel>
									<Input
										id={field.name}
										name={field.name}
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={e => field.handleChange(e.target.value)}
										aria-invalid={isInvalid}
										placeholder="Ej. Lun a Vie de 08:00 a 18:00"
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
						name="logo"
						children={field => {
							const isInvalid =
								field.state.meta.isTouched && !field.state.meta.isValid
							return (
								<Field data-invalid={isInvalid} className="relative gap-1">
									<FieldLabel htmlFor={field.name}>Logo Empresarial</FieldLabel>
									<FileDropzone
										text="Imágen Logo"
										defaultValue={logoFile}
										onUploaded={url => {
											// console.log("URL matricula", url)
											if (url.length > 0 && url !== logoFile) {
												setLogoFile(url)
											} else setLogoFile("")
										}}
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
				</div>

				<div className="flex justify-end items-center gap-2 w-11/12 mcx-auto text-destructive">
					<Asterisk className="text-destructive size-3" />
					<span className="text-xs 2xl:text-sm italic tracking-wide">
						campo obligatorio
					</span>
				</div>

				<Field className="flex flex-col justify-center gap-4 sm:gap-10 items-center w-5/6 mx-auto sm:w-full mt-10">
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
	)
}
