import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type {
	IluminacionFuenteType,
	IluminacionTipoType,
	IluminacionType,
	ValoresRequeridosType,
} from "@/lib/constants"
import {
	FECHA_1970,
	ILUMINACION,
	ILUMINACION_FUENTE,
	ILUMINACION_TIPO,
	VALORES_REQUERIDOS,
} from "@/lib/constants"
import { useForm } from "@tanstack/react-form"

import { Box, HardHat, Lightbulb, Loader, Trash2 } from "lucide-react"
import {
	AlertDialog,
	AlertDialogTrigger,
	AlertDialogContent,
	AlertDialogTitle,
	AlertDialogDescription,
} from "@/components/ui/alert-dialog"
import {
	useEffect,
	useRef,
	useState,
	type Dispatch,
	type SetStateAction,
} from "react"
import Formula from "./formula"
import {
	getIndiceDeLocal,
	getIndiceRedondeo,
	setResetPuntos,
} from "#/lib/utils"
import {
	areaFormValidator,
	defaultAreaData,
} from "../../../../../db/reportes/iluminacion/areas/area-validator"
import { useCreateArea } from "../../../../../queries/reportes/iluminacion/areas/use-create-area"
import { Button } from "#/components/ui/button"
import Title from "#/components/title"
import { useSuspenseQuery } from "@tanstack/react-query"
import { reporteNuevoQueryOptions } from "../../../../../queries/reportes/iluminacion/reportes-query"
import { FilesDropzone } from "#/components/upload-button"

export default function CreateAreaAlert() {
	const [open, setOpen] = useState(false)
	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogTrigger asChild className="hover:bg-accent">
				<Button className="w-1/2 mx-auto py-5 bg-primary ring-foreground/25">
					+ Nueva Area
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent className="sm:px-20 py-15 sm:py-6 w-full h-screen sm:h-[95dvh] overflow-auto border-none rounded-none max-w-screen">
				<AlertDialogTitle>
					<Title text="Nueva Area" />
				</AlertDialogTitle>
				<AlertDialogDescription asChild>
					<div className="text-center">
						<CreateArea setOpen={setOpen} />
					</div>
				</AlertDialogDescription>
			</AlertDialogContent>
		</AlertDialog>
	)
}

function CreateArea({
	setOpen,
}: {
	setOpen: Dispatch<SetStateAction<boolean>>
}) {
	const [puntos, setPuntos] = useState<number[]>([])
	const [timestamps, setTimestamps] = useState<Date[]>([])
	const [puntosError, setPuntosError] = useState<string | null>(null)
	const [planoFiles, setPlanoFiles] = useState<string[]>([])
	const { data: reporteNuevo } = useSuspenseQuery(reporteNuevoQueryOptions)
	const [indiceRedondeo, setIndiceRedondeo] = useState<number>(0)

	const { mutateAsync: createArea, isPending, error } = useCreateArea()

	const form = useForm({
		defaultValues: defaultAreaData,
		validators: {
			onSubmit: areaFormValidator,
		},
		onSubmit: async ({ value }) => {
			setPuntosError(null)
			if (puntos.every(punto => punto === 0))
				return setPuntosError("Debe agregar al menos un punto de medición")
			if (!reporteNuevo) return
			const newArea = {
				...value,
				reportId: reporteNuevo.id,
				puntos,
				timestamps,
				imagenes: planoFiles,
			}
			const result = await createArea({ data: newArea })
			if (!result) {
				console.error("Error al crear area", error)
				return
			}
			console.log("Área creada exitosamente")
			setOpen(false)
		},
	})

	return (
		<form
			id="create-form"
			onSubmit={e => {
				e.preventDefault()
				form.handleSubmit()
			}}
			className="w-full my-5 sm:my-4 flex flex-col gap-8 relative"
		>
			<FieldGroup className="gap-5">
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-5/6 mt-10 mx-auto">
					<form.Field
						name="nombre"
						children={field => {
							const isInvalid =
								field.state.meta.isTouched && !field.state.meta.isValid
							return (
								<Field data-invalid={isInvalid} className="relative gap-1">
									<FieldLabel
										htmlFor={field.name}
										className="flex items-center gap-3 textL"
									>
										Nombre del Area
									</FieldLabel>
									<Input
										id={field.name}
										name={field.name}
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={e => field.handleChange(e.target.value)}
										aria-invalid={isInvalid}
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
						name="tipo"
						children={field => {
							const isInvalid =
								field.state.meta.isTouched && !field.state.meta.isValid
							return (
								<Field data-invalid={isInvalid} className="relative gap-1">
									<FieldLabel
										htmlFor={field.name}
										className="flex items-center gap-3 textL"
									>
										Tipo del Area
									</FieldLabel>
									<Input
										id={field.name}
										name={field.name}
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={e => field.handleChange(e.target.value)}
										aria-invalid={isInvalid}
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

				<div className="flex items-center justify-between border-b border-cyan-500 dark:border-cyan-300/25 my-10 w-full">
					<div className="textL py-2 px-3 flex items-center gap-8 justify-between w-full">
						Iluminación{" "}
						<Lightbulb className="sm:size-7 2xl:size-9 text-cyan-500 dark:text-cyan-300/75" />
					</div>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-5/6 mt-10 mx-auto">
					<form.Field
						name="iluminacionTipo"
						children={field => {
							const isInvalid =
								field.state.meta.isTouched && !field.state.meta.isValid

							return (
								<Field data-invalid={isInvalid} className="relative gap-1">
									<FieldLabel
										htmlFor={field.name}
										className="flex items-center gap-3 textL"
									>
										Tipo de Iluminación
									</FieldLabel>

									<Select
										value={field.state.value || ""}
										onValueChange={value =>
											field.handleChange(value as IluminacionTipoType)
										}
									>
										<SelectTrigger
											id={field.name}
											name={field.name}
											onBlur={field.handleBlur}
											aria-invalid={isInvalid}
											className="w-full justify-end"
										>
											<SelectValue placeholder="Seleccione Clima" />
										</SelectTrigger>

										<SelectContent position="popper">
											<SelectGroup>
												<SelectLabel>Iluminacion Tipo</SelectLabel>

												{ILUMINACION_TIPO?.map(iluminacionTipo => (
													<SelectItem
														key={iluminacionTipo}
														value={iluminacionTipo}
														className="justify-center"
													>
														{iluminacionTipo.toUpperCase()}
													</SelectItem>
												))}
											</SelectGroup>
										</SelectContent>
									</Select>

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
						name="iluminacionFuente"
						children={field => {
							const isInvalid =
								field.state.meta.isTouched && !field.state.meta.isValid

							return (
								<Field data-invalid={isInvalid} className="relative gap-1">
									<FieldLabel
										htmlFor={field.name}
										className="flex items-center gap-3 textL"
									>
										Fuente de Iluminación
									</FieldLabel>

									<Select
										value={field.state.value || ""}
										onValueChange={value =>
											field.handleChange(value as IluminacionFuenteType)
										}
									>
										<SelectTrigger
											id={field.name}
											name={field.name}
											onBlur={field.handleBlur}
											aria-invalid={isInvalid}
											className="w-full justify-end"
										>
											<SelectValue placeholder="Seleccione Fuente" />
										</SelectTrigger>

										<SelectContent position="popper">
											<SelectGroup>
												<SelectLabel>Iluminacion Fuente</SelectLabel>

												{ILUMINACION_FUENTE?.map(iluminacionFuente => (
													<SelectItem
														key={iluminacionFuente}
														value={iluminacionFuente}
														className="justify-center"
													>
														{iluminacionFuente.toUpperCase()}
													</SelectItem>
												))}
											</SelectGroup>
										</SelectContent>
									</Select>

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
						name="iluminacion"
						children={field => {
							const isInvalid =
								field.state.meta.isTouched && !field.state.meta.isValid

							return (
								<Field data-invalid={isInvalid} className="relative gap-1">
									<FieldLabel
										htmlFor={field.name}
										className="flex items-center gap-3 textL"
									>
										Iluminación
									</FieldLabel>

									<Select
										value={field.state.value || ""}
										onValueChange={value =>
											field.handleChange(value as IluminacionType)
										}
									>
										<SelectTrigger
											id={field.name}
											name={field.name}
											onBlur={field.handleBlur}
											aria-invalid={isInvalid}
											className="w-full justify-end"
										>
											<SelectValue placeholder="Seleccione Iluminacion" />
										</SelectTrigger>

										<SelectContent position="popper">
											<SelectGroup>
												<SelectLabel>Iluminacion</SelectLabel>

												{ILUMINACION?.map(iluminacion => (
													<SelectItem
														key={iluminacion}
														value={iluminacion}
														className="justify-center"
													>
														{iluminacion.toUpperCase()}
													</SelectItem>
												))}
											</SelectGroup>
										</SelectContent>
									</Select>

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
						name="valorRequerido"
						children={field => {
							const isInvalid =
								field.state.meta.isTouched && !field.state.meta.isValid

							return (
								<Field data-invalid={isInvalid} className="relative gap-1">
									<FieldLabel
										htmlFor={field.name}
										className="flex items-center gap-3 textL"
									>
										Valor Requerido
									</FieldLabel>

									<Select
										value={field.state.value || ""}
										onValueChange={value =>
											field.handleChange(value as ValoresRequeridosType)
										}
									>
										<SelectTrigger
											id={field.name}
											name={field.name}
											onBlur={field.handleBlur}
											aria-invalid={isInvalid}
											className="w-full justify-end"
										>
											<SelectValue placeholder="Seleccione Valor" />
										</SelectTrigger>

										<SelectContent position="popper">
											<SelectGroup>
												<SelectLabel>Valores</SelectLabel>

												{VALORES_REQUERIDOS?.map(valorRequerido => (
													<SelectItem
														key={valorRequerido}
														value={valorRequerido}
														className="justify-center"
													>
														{valorRequerido.toUpperCase()}
													</SelectItem>
												))}
											</SelectGroup>
										</SelectContent>
									</Select>

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
						name="observaciones"
						children={field => {
							const isInvalid =
								field.state.meta.isTouched && !field.state.meta.isValid
							return (
								<Field data-invalid={isInvalid} className="relative gap-1">
									<FieldLabel
										htmlFor={field.name}
										className="flex items-center gap-3 textL"
									>
										Observaciones
									</FieldLabel>
									<Textarea
										id={field.name}
										name={field.name}
										value={field.state.value || ""}
										onBlur={field.handleBlur}
										onChange={e => field.handleChange(e.target.value)}
										aria-invalid={isInvalid}
										className="bg-background sm:bg-accent text-right text-sm"
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

				<div className="flex items-center justify-between border-b border-orange-700/50 dark:border-orange-300/50 my-10 w-full">
					<div className="textL py-2 px-3 flex items-center gap-8 justify-between w-full">
						Dimensiones{" "}
						<Box className="sm:size-7 2xl:size-9 text-orange-700/70 dark:text-orange-300/75" />
					</div>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-5/6 mt-10 mx-auto">
					<form.Field
						name="largo"
						children={field => {
							const isInvalid =
								field.state.meta.isTouched && !field.state.meta.isValid
							return (
								<Field data-invalid={isInvalid} className="relative gap-1">
									<FieldLabel htmlFor={field.name}>Largo(m)</FieldLabel>
									<Input
										id={field.name}
										name={field.name}
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={e => field.handleChange(Number(e.target.value))}
										aria-invalid={isInvalid}
										placeholder="Ej. 4"
										type="number"
										className="text-center"
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
						name="ancho"
						children={field => {
							const isInvalid =
								field.state.meta.isTouched && !field.state.meta.isValid
							return (
								<Field data-invalid={isInvalid} className="relative gap-1">
									<FieldLabel htmlFor={field.name}>Ancho(m)</FieldLabel>
									<Input
										id={field.name}
										name={field.name}
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={e => field.handleChange(Number(e.target.value))}
										aria-invalid={isInvalid}
										placeholder="Ej. 5"
										type="number"
										className="text-center"
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
						name="alto"
						children={field => {
							const isInvalid =
								field.state.meta.isTouched && !field.state.meta.isValid
							return (
								<Field data-invalid={isInvalid} className="relative gap-1">
									<FieldLabel htmlFor={field.name}>
										Alto del montaje (m)
									</FieldLabel>
									<Input
										id={field.name}
										name={field.name}
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={e => field.handleChange(Number(e.target.value))}
										aria-invalid={isInvalid}
										placeholder="Ej. 2"
										type="number"
										className="text-center"
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

				<div className="flex flex-col gap-1 w-5/6 mx-auto sm:w-full my-10">
					<Label className="tracking-wider" htmlFor="largo">
						Imágenes del Área
					</Label>
					<FilesDropzone
						text="Imágenes Area"
						defaultValue={planoFiles}
						onUploaded={url => {
							// console.log("URL matricula", url)
							if (url.length > 0 && url !== planoFiles) {
								setPlanoFiles(url)
							} else setPlanoFiles([])
						}}
					/>
				</div>

				<form.Subscribe
					selector={state =>
						`${state.values.largo}-${state.values.ancho}-${state.values.alto}`
					}
					children={values => {
						const [largo, ancho, alto] = values.split("-").map(Number)
						if (largo * ancho * alto === 0) return null
						const indiceDeLocal = getIndiceDeLocal(largo, ancho, alto)
						const newIndiceRedondeo = getIndiceRedondeo(indiceDeLocal)
						if (indiceRedondeo !== newIndiceRedondeo) {
							setIndiceRedondeo(newIndiceRedondeo)
							const newCeldas = (newIndiceRedondeo + 2) ** 2
							const { resetPuntos, resetTimestamps } = setResetPuntos(newCeldas)
							setPuntos(resetPuntos)
							setTimestamps(resetTimestamps)
						}
						return (
							largo > 0 &&
							ancho > 0 &&
							alto > 0 && (
								<>
									<Formula
										alto={Number(alto)}
										ancho={Number(ancho)}
										largo={Number(largo)}
										indiceDeLocal={indiceDeLocal}
										indiceRedondeo={newIndiceRedondeo}
									/>
									<Grilla
										puntos={puntos}
										setPuntos={setPuntos}
										timestamps={timestamps}
										setTimestamps={setTimestamps}
										ancho={Number(ancho)}
										largo={Number(largo)}
										indiceRedondeo={newIndiceRedondeo}
									/>
								</>
							)
						)
					}}
				/>

				<Field className="flex flex-col sm:flex-row justify-center gap-4 items-center w-5/6 sm:w-full mx-auto mt-10">
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

				{puntosError && (
					<p className="text-center italic textXS text-red-500/70">
						{puntosError}
					</p>
				)}
				{error && (
					<p className="text-center italic textXS text-red-500/70">
						{error?.message}
					</p>
				)}

				<form.Subscribe
					selector={state => state.errors}
					children={errors =>
						errors.length > 0 && (
							<span className="text-red-500/70 italic w-full text-center ">
								Faltan campos por completar
							</span>
						)
					}
				/>
			</FieldGroup>
		</form>
	)
}

function Grilla({
	puntos,
	setPuntos,
	timestamps,
	setTimestamps,
	ancho,
	largo,
	indiceRedondeo,
}: {
	ancho: number
	largo: number
	puntos: number[]
	setPuntos: Dispatch<SetStateAction<number[]>>
	timestamps: Date[]
	setTimestamps: Dispatch<SetStateAction<Date[]>>
	indiceRedondeo: number
}) {
	const [openInputMenu, setOpenInputMenu] = useState<boolean>(false)
	const [actualPunto, setActualPunto] = useState<number | null>(null)

	const celdas = (indiceRedondeo + 2) ** 2
	const div = Math.sqrt(celdas).toFixed(0)
	const divisionesLargo = Number(div)
	const divisionesAncho = Number(div)
	const largoRatio = 150 * divisionesLargo
	const anchoGrilla = `${(ancho / largo) * largoRatio}px`
	const largoGrilla = `${150 * divisionesLargo}px`
	useEffect(() => {
		const { resetPuntos, resetTimestamps } = setResetPuntos(celdas)
		setPuntos(resetPuntos)
		setTimestamps(resetTimestamps)
	}, [celdas, setPuntos, setTimestamps])

	return (
		<>
			<div className="flex items-center justify-between border-b border-purple-700/75 dark:border-purple-500/75 my-10 w-full">
				<div className="textL py-2 px-3 flex items-center gap-8 justify-between w-full">
					Mediciones{" "}
					<HardHat className="sm:size-7 2xl:size-9 text-purple-700/75 dark:text-purple-500/75" />
				</div>
			</div>

			{openInputMenu ? (
				<InputMenu
					setOpenInputMenu={setOpenInputMenu}
					puntos={puntos}
					setPuntos={setPuntos}
					timestamps={timestamps}
					setTimestamps={setTimestamps}
					actualPunto={actualPunto}
					setActualPunto={setActualPunto}
				/>
			) : (
				<div className="w-[90dvw] sm:w-full min-h-[500px] overflow-auto flex flex-col p-10">
					<div
						className="grid relative mx-auto"
						style={{
							height: largoGrilla,
							width: anchoGrilla,
							gridTemplateColumns: `repeat(${divisionesAncho}, 1fr)`,
							gridTemplateRows: `repeat(${divisionesLargo}, 1fr)`,
						}}
					>
						<span className="absolute left-0 -top-10 w-full border-b border-foreground/20 text-foreground/20">
							Ancho: {ancho}m
						</span>
						<span
							className={`absolute -left-4 bottom-0 border-b border-foreground/20 text-foreground/20 -rotate-90 origin-bottom-left`}
							style={{ width: largoGrilla }}
						>
							Largo: {largo}m
						</span>
						{Array.from({ length: celdas }).map((_, index) => (
							<div
								key={index}
								className={`border dark:border-cyan-300/20 border-cyan-700/30 flex items-center justify-center ${puntos[index] !== 0 ? "bg-cyan-300/20" : ""}`}
							>
								<Punto
									index={index}
									puntos={puntos}
									setOpenInputMenu={setOpenInputMenu}
									setActualPunto={setActualPunto}
								/>
							</div>
						))}
					</div>
				</div>
			)}

			<AreaPuntosList
				puntos={puntos}
				setPuntos={setPuntos}
				timestamps={timestamps}
				setTimestamps={setTimestamps}
			/>
		</>
	)
}

function Punto({
	index,
	setOpenInputMenu,
	puntos,
	setActualPunto,
}: {
	index: number
	setOpenInputMenu: Dispatch<SetStateAction<boolean>>
	puntos: number[]
	setActualPunto: Dispatch<SetStateAction<number | null>>
}) {
	return (
		<div className="flex flex-col gap-1 items-center justify-center">
			<span className="italic tracking-widest text-xs text-foreground">
				punto-{index + 1}
			</span>
			<button
				onClick={() => {
					setOpenInputMenu(true)
					setActualPunto(index)
				}}
				className="w-15 text-xl font-semibold py-1 px-3 bg-accent text-foreground justify-center items-center min-h-9 rounded-sm ring-[1px] dark:ring-foreground/15 ring-foreground/50"
			>
				{puntos[index] !== 0 ? puntos[index] : "*"}
			</button>
		</div>
	)
}

function InputMenu({
	setOpenInputMenu,
	puntos,
	setPuntos,
	timestamps,
	setTimestamps,
	actualPunto,
	setActualPunto,
}: {
	setOpenInputMenu: Dispatch<SetStateAction<boolean>>
	puntos: number[]
	setPuntos: Dispatch<SetStateAction<number[]>>
	timestamps: Date[]
	setTimestamps: Dispatch<SetStateAction<Date[]>>
	actualPunto: number | null
	setActualPunto: Dispatch<SetStateAction<number | null>>
}) {
	const inputRef = useRef<HTMLInputElement | null>(null)
	const [puntoValue, setPuntoValue] = useState<string>("")

	useEffect(() => {
		if (inputRef.current) {
			inputRef.current.focus()
			inputRef.current.select()
		}
	}, [])

	function handleSetPunto() {
		if (actualPunto === null) return
		const newPuntos = [...puntos]
		newPuntos[actualPunto] = Number(puntoValue)
		setPuntos(newPuntos)
		const newTimestamps = [...timestamps]
		newTimestamps[actualPunto] = new Date()
		setTimestamps(newTimestamps)
		setOpenInputMenu(false)
		setActualPunto(null)
	}
	return (
		<div className="min-h-[500px] bg-accent rounded-lg ring-[1px] ring-foreground/15 flex items-center justify-center gap-10 flex-col w-full p-10">
			<span className="border-b py-2 border-foreground/50 w-full text-left text-foreground/70">
				Punto {actualPunto !== null ? actualPunto + 1 : ""}
			</span>
			<Input
				ref={inputRef}
				defaultValue={
					actualPunto !== null && puntos[actualPunto] !== 0
						? puntos[actualPunto]
						: ""
				}
				type="number"
				id="punto"
				name="punto"
				className="dark:bg-foreground/50 bg-foreground/50 text-background/75 textXL text-4xl w-3/4 sm:w-1/2 p-4 h-20 text-center rounded-md"
				onChange={e => setPuntoValue(e.currentTarget.value)}
			/>
			<div className="w-full flex flex-col justify-between gap-4">
				<Button
					type="button"
					variant="outline"
					onClick={() => setOpenInputMenu(false)}
					className="flex-1"
				>
					Cancelar
				</Button>
				<Button type="button" className="flex-1" onClick={handleSetPunto}>
					Guardar
				</Button>
			</div>
		</div>
	)
}

function AreaPuntosList({
	puntos,
	setPuntos,
	timestamps,
	setTimestamps,
}: {
	puntos: number[]
	setPuntos: Dispatch<SetStateAction<number[]>>
	timestamps: Date[]
	setTimestamps: Dispatch<SetStateAction<Date[]>>
}) {
	const handleSetPunto = (index: number) => {
		const newPuntos = puntos.map((np, indexNP) => (indexNP === index ? 0 : np))
		setPuntos(newPuntos)
		const newTimestamps = timestamps.map((nt, indexNT) =>
			indexNT === index ? FECHA_1970 : nt
		)
		setTimestamps(newTimestamps)
	}

	return (
		<div className="grid grid-cols-2 sm:grid-cols-3 gap-4  textXS">
			{puntos.map((punto, index) => (
				<div
					key={index}
					className="flex items-center justify-between p-2 border-b border-foreground/20"
				>
					<span>punto-{index + 1}</span>
					<span>{punto}</span>
					<button type="button" onClick={() => handleSetPunto(index)}>
						<Trash2 className="size-4 cursor-pointer text-red-700/50" />
					</button>
				</div>
			))}
		</div>
	)
}
