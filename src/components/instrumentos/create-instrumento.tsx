import { useState } from "react"
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
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
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import Title from "../title"
import { useCreateInstrumento } from "../../../queries/instrumentos/use-create-instrumento"
import {
	defaultInstrumento,
	instrumentoFormValidator,
} from "../../../db/instrumentos/instrumento-validator"
import { InputFiles } from "../input-files"
import { Button } from "../ui/button"

export function CreateInstrumento() {
	const [open, setOpen] = useState(false)

	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogTrigger asChild className="hover:bg-accent">
				<Button
					variant="secondary"
					className="w-1/2 mx-auto ring-[1px] ring-foreground/25 py-5"
				>
					Cargar datos
				</Button>
			</AlertDialogTrigger>

			<AlertDialogContent className="bg-background sm:px-20 py-15 sm:py-6 w-full sm:w-1/2 h-screen sm:h-[95dvh] overflow-auto border-none rounded-none max-w-screen">
				<AlertDialogTitle>
					<Title text="Instrumento Nuevo" />
				</AlertDialogTitle>

				<AlertDialogDescription asChild>
					<div className="text-center">
						<InstrumentoForm setOpen={setOpen} />
					</div>
				</AlertDialogDescription>
			</AlertDialogContent>
		</AlertDialog>
	)
}

const InstrumentoForm = ({ setOpen }: { setOpen: (open: boolean) => void }) => {
	const [imagenCalibracion, setImagenCalibracion] = useState<File[]>([])
	const [instrumentoFiles, setInstrumentoFiles] = useState<File[]>([])
	const [calibrationDate, setCalibrationDate] = useState<Date>()
	const [openPopover, setOpenPopover] = useState(false)

	const {
		mutateAsync: createInstrumentoMutation,
		isPending,
		error,
	} = useCreateInstrumento()

	const form = useForm({
		defaultValues: defaultInstrumento,

		validators: {
			onSubmit: instrumentoFormValidator,
		},

		onSubmit: async ({ value }) => {
			const result = await createInstrumentoMutation({ data: value })

			if (!result) {
				console.error("Error al crear el instrumento", error)
			}

			setOpen(false)
			console.log("Instrumento creado exitosamente")
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
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={e => field.handleChange(e.target.value)}
										aria-invalid={isInvalid}
										placeholder="Ej. Luxómetro"
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
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={e => field.handleChange(e.target.value)}
										aria-invalid={isInvalid}
										placeholder="Ej. DataLogger"
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
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={e => field.handleChange(e.target.value)}
										aria-invalid={isInvalid}
										placeholder="Ej. DT-8809A"
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
						name="serie"
						children={field => {
							const isInvalid =
								field.state.meta.isTouched && !field.state.meta.isValid

							return (
								<Field data-invalid={isInvalid} className="relative gap-1">
									<FieldLabel htmlFor={field.name}>
										Nro de serie{" "}
										<Asterisk className="text-destructive size-3" />
									</FieldLabel>

									<Input
										id={field.name}
										name={field.name}
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={e => field.handleChange(e.target.value)}
										aria-invalid={isInvalid}
										placeholder="Ej. 32451"
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
													setCalibrationDate(date)
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
						name="imagenCalibracion"
						children={field => {
							const isInvalid =
								field.state.meta.isTouched && !field.state.meta.isValid

							return (
								<Field data-invalid={isInvalid} className="relative gap-1">
									<FieldLabel htmlFor={field.name}>
										Imágen del certificado de calibración
									</FieldLabel>

									<InputFiles
										files={imagenCalibracion}
										setFiles={setImagenCalibracion}
										text="Imágen del certificado de calibración"
										maxFiles={1}
										editMode={true}
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

									<InputFiles
										files={instrumentoFiles}
										setFiles={setInstrumentoFiles}
										text="Imágen del instrumento"
										maxFiles={3}
										editMode={true}
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
				<div className="flex justify-end items-center gap-2 w-5/6 mx-auto text-destructive">
					<Asterisk className="text-destructive size-3" />

					<span className="text-xs 2xl:text-sm italic tracking-wide">
						campo obligatorio
					</span>
				</div>

				<Field className="flex flex-col justify-center gap-4 sm:gap-10 items-center w-5/6 mx-auto sm:w-full mt-10">
					<Button
						variant="outline"
						onClick={() => setOpen(false)}
						type="button"
						disabled={isPending}
						className="flex-1 p-4"
					>
						Cancelar
					</Button>

					<Button
						variant="secondary"
						type="submit"
						disabled={isPending}
						className="flex-1 p-4 ring-[1px] ring-foreground/20"
					>
						{isPending ? (
							<div className="flex gap-2 w-full justify-center items-center">
								Guardando... <Loader className="animate-spin size-4"></Loader>
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
