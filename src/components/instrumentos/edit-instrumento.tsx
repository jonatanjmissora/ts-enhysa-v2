import { useState } from "react"
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Asterisk, Loader, Pencil } from "lucide-react"
import { useForm } from "@tanstack/react-form"
import { checkInstrumentoDiference } from "@/lib/utils"
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import {
	AlertDialog,
	AlertDialogTrigger,
	AlertDialogContent,
	AlertDialogTitle,
	AlertDialogDescription,
} from "@/components/ui/alert-dialog"
import Title from "../title"
import type { InstrumentoType } from "../../../db/instrumentos/schema"
import { useUpdateInstrumento } from "../../../queries/instrumentos/use-update-instrumento"
import { updateInstrumentoValidator } from "../../../db/instrumentos/instrumento-validator"
import { Button } from "../ui/button"
import { FilesDropzone } from "../upload-button"

export function EditInstrumento({
	instrumento,
	setIsMenuOpen,
}: {
	instrumento: InstrumentoType
	setIsMenuOpen?: (open: boolean) => void
}) {
	const [open, setOpen] = useState(false)
	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogTrigger asChild>
				<div className="w-full flex items-center gap-2 justify-center p-4">
					<Pencil size={14} className="text-foreground" />
					Editar
				</div>
			</AlertDialogTrigger>
			<AlertDialogContent className="sm:px-20 py-15 sm:py-6 w-full h-screen sm:h-[95dvh] overflow-auto border-none rounded-none max-w-screen">
				<AlertDialogTitle>
					<Title text="Editar Instrumento" />
				</AlertDialogTitle>
				<AlertDialogDescription asChild>
					<div className="text-center">
						<EditInstrumentoForm
							instrumento={instrumento}
							setOpen={setOpen}
							setIsMenuOpen={setIsMenuOpen}
						/>
					</div>
				</AlertDialogDescription>
			</AlertDialogContent>
		</AlertDialog>
	)
}

export function EditInstrumentoForm({
	instrumento,
	setOpen,
	setIsMenuOpen,
}: {
	instrumento: InstrumentoType
	setOpen: (open: boolean) => void
	setIsMenuOpen?: (open: boolean) => void
}) {
	const [openPopover, setOpenPopover] = useState(false)
	const [calibrationDate, setCalibrationDate] = useState<Date>(
		instrumento.fechaCalibracion
	)
	const [instrumentoFiles, setInstrumentoFiles] = useState<string[]>(
		instrumento.imagenes ?? []
	)
	const [imagenesCalibracion, setimagenesCalibracion] = useState<string[]>(
		instrumento.imagenesCalibracion ?? []
	)
	const {
		mutateAsync: updateInstrumentoMutation,
		isPending,
		error,
	} = useUpdateInstrumento()

	const form = useForm({
		defaultValues: { ...instrumento },
		validators: {
			onSubmit: updateInstrumentoValidator,
		},
		onSubmit: async ({ value }) => {
			const updateInstrumento = {
				...value,
				id: instrumento.id,
				userId: instrumento.userId,
				fechaCalibracion: calibrationDate,
				imagenesCalibracion: imagenesCalibracion,
				imagenes: instrumentoFiles,
			}

			if (checkInstrumentoDiference(updateInstrumento, instrumento)) {
				setOpen(false)
				return
			}

			const result = await updateInstrumentoMutation({
				data: updateInstrumento,
			})
			if (!result) {
				console.error("Error al actualizar el instrumento", error)
			}
			if (setIsMenuOpen) setIsMenuOpen(false)
			setOpen(false)
			console.log("Instrumento actualizado exitosamente")
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
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-7 sm:gap-y-4 sm:gap-x-10 justify-center items-start w-5/6 sm:w-full mx-auto">
					<form.Field
						name="nombre"
						children={field => {
							const isInvalid =
								field.state.meta.isTouched && !field.state.meta.isValid
							return (
								<Field data-invalid={isInvalid} className="relative gap-1">
									<FieldLabel htmlFor={field.name}>
										Nombre
										<Asterisk className="text-destructive size-3" />
									</FieldLabel>
									<Input
										id={field.name}
										name={field.name}
										value={field.state.value.toUpperCase()}
										onBlur={field.handleBlur}
										onChange={e => field.handleChange(e.target.value)}
										aria-invalid={isInvalid}
										placeholder="Ej. Luxómetro"
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
						name="marca"
						children={field => {
							const isInvalid =
								field.state.meta.isTouched && !field.state.meta.isValid
							return (
								<Field data-invalid={isInvalid} className="relative gap-1">
									<FieldLabel htmlFor={field.name}>
										Marca
										<Asterisk className="text-destructive size-3" />
									</FieldLabel>
									<Input
										id={field.name}
										name={field.name}
										value={field.state.value.toUpperCase()}
										onBlur={field.handleBlur}
										onChange={e => field.handleChange(e.target.value)}
										aria-invalid={isInvalid}
										placeholder="Ej. DataLogger"
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
						name="modelo"
						children={field => {
							const isInvalid =
								field.state.meta.isTouched && !field.state.meta.isValid
							return (
								<Field data-invalid={isInvalid} className="relative gap-1">
									<FieldLabel htmlFor={field.name}>Modelo</FieldLabel>
									<Input
										id={field.name}
										name={field.name}
										value={field.state.value.toUpperCase()}
										onBlur={field.handleBlur}
										onChange={e => field.handleChange(e.target.value)}
										aria-invalid={isInvalid}
										placeholder="Ej. DT-8809A"
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
						name="serie"
						children={field => {
							const isInvalid =
								field.state.meta.isTouched && !field.state.meta.isValid
							return (
								<Field data-invalid={isInvalid} className="relative gap-1">
									<FieldLabel htmlFor={field.name}>
										Nro de serie
										<Asterisk className="text-destructive size-3" />
									</FieldLabel>
									<Input
										id={field.name}
										name={field.name}
										value={field.state.value.toUpperCase()}
										onBlur={field.handleBlur}
										onChange={e => field.handleChange(e.target.value)}
										aria-invalid={isInvalid}
										placeholder="Ej. 32451"
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
						name="fechaCalibracion"
						children={field => {
							const isInvalid =
								field.state.meta.isTouched && !field.state.meta.isValid
							return (
								<Field data-invalid={isInvalid} className="relative gap-1">
									<FieldLabel htmlFor="date-picker-simple">
										Fecha de calibración
									</FieldLabel>
									<Popover open={openPopover} onOpenChange={setOpenPopover}>
										<PopoverTrigger asChild>
											<button
												id="date-picker-simple"
												className="card p-[8px] bg-accent rounded-sm ring-[1px] ring-foreground/10 justify-center"
											>
												{calibrationDate ? (
													format(calibrationDate, "dd-MM-yyyy")
												) : (
													<span className="text-foreground/30">
														Ej. 12-10-2025
													</span>
												)}
											</button>
										</PopoverTrigger>
										<PopoverContent className="w-auto p-0" align="start">
											<Calendar
												mode="single"
												selected={calibrationDate}
												onSelect={date => {
													setCalibrationDate(date || new Date())
													setOpenPopover(false)
												}}
												defaultMonth={calibrationDate}
											/>
										</PopoverContent>
									</Popover>
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
						name="imagenesCalibracion"
						children={field => {
							const isInvalid =
								field.state.meta.isTouched && !field.state.meta.isValid
							return (
								<Field data-invalid={isInvalid} className="relative gap-1">
									<FieldLabel htmlFor={field.name}>Imagenes</FieldLabel>
									<FilesDropzone
										text="Imágen Calibración"
										defaultValue={imagenesCalibracion}
										onUploaded={url => {
											// console.log("URL matricula", url)
											if (url.length > 0 && url !== imagenesCalibracion) {
												setimagenesCalibracion(url)
											} else setimagenesCalibracion([])
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

					<form.Field
						name="imagenes"
						children={field => {
							const isInvalid =
								field.state.meta.isTouched && !field.state.meta.isValid
							return (
								<Field data-invalid={isInvalid} className="relative gap-1">
									<FieldLabel htmlFor={field.name}>Imagenes</FieldLabel>
									<FilesDropzone
										text="Imágen Instrumento"
										defaultValue={instrumentoFiles}
										onUploaded={url => {
											// console.log("URL matricula", url)
											if (url.length > 0 && url !== instrumentoFiles) {
												setInstrumentoFiles(url)
											} else setInstrumentoFiles([])
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

				<div className="flex justify-end items-center gap-2 w-11/12 mx auto text-destructive">
					<Asterisk className="text-destructive size-3" />
					<span className="text-xs 2xl:text-sm italic tracking-wide">
						campo obligatorio
					</span>
				</div>

				<Field className="flex flex-col justify-center gap-4 sm:flex-row items-center w-5/6 mx-auto sm:w-full mt-10">
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
					<Button type="submit" disabled={isPending} className="flex-1 py-5">
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
