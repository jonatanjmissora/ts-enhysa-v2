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
import {
	FECHA_1970,
	ILUMINACION,
	ILUMINACION_FUENTE,
	ILUMINACION_TIPO,
	VALORES_REQUERIDOS,
	type IluminacionFuenteType,
	type IluminacionTipoType,
	type IluminacionType,
	type ValoresRequeridosType,
} from "@/lib/constants"
import { useForm } from "@tanstack/react-form"
import { Box, Edit, HardHat, Lightbulb, Loader, Trash2 } from "lucide-react"
import {
	useEffect,
	useRef,
	useState,
	type Dispatch,
	type SetStateAction,
} from "react"
import Formula from "./formula"
import { getIndiceDeLocal, getIndiceRedondeo } from "@/lib/utils"
import {
	AlertDialog,
	AlertDialogTrigger,
	AlertDialogContent,
	AlertDialogTitle,
	AlertDialogDescription,
} from "@/components/ui/alert-dialog"
import type { AreaIluminacionType } from "../../../../../db/reportes/iluminacion/areas/schema"
import { InputFiles } from "#/components/input-files"
import { updateAreaValidator } from "../../../../../db/reportes/iluminacion/areas/area-validator"
import { useUpdateArea } from "../../../../../queries/reportes/iluminacion/areas/use-update-area"
import { Button } from "#/components/ui/button"
import Title from "#/components/title"

export default function EditAreaAlert({
	area,
	setIsMenuOpen,
}: {
	area: AreaIluminacionType
	setIsMenuOpen: Dispatch<SetStateAction<boolean>>
}) {
	const [open, setOpen] = useState(false)
	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogTrigger asChild className="hover:bg-accent">
				<div className="w-full flex items-center gap-2 justify-center p-4">
					<Edit className="size-4" />
					Editar
				</div>
			</AlertDialogTrigger>
			<AlertDialogContent className="bg-background sm:px-20 py-15 sm:py-6 w-full sm:w-1/2 h-screen sm:h-[95dvh] overflow-auto border-none rounded-none max-w-screen">
				<AlertDialogTitle>
					<Title text="Editar Area" />
				</AlertDialogTitle>
				<AlertDialogDescription className="text-center">
					<EditArea
						area={area}
						setOpen={setOpen}
						setIsMenuOpen={setIsMenuOpen}
					/>
				</AlertDialogDescription>
			</AlertDialogContent>
		</AlertDialog>
	)
}

function EditArea({
	area,
	setOpen,
	setIsMenuOpen,
}: {
	area: AreaIluminacionType
	setOpen: (open: boolean) => void
	setIsMenuOpen: (open: boolean) => void
}) {
	const [puntos, setPuntos] = useState<number[]>(area.puntos)
	const [timestamps, setTimestamps] = useState<Date[]>(area.timestamps)
	const [puntosError, setPuntosError] = useState<string | null>(null)
	const [planoFiles, setPlanoFiles] = useState<File[]>([])

	const { mutateAsync: updateNRpart2, isPending, error } = useUpdateArea()

	const form = useForm({
		defaultValues: {
			...area,
		},
		validators: {
			onSubmit: updateAreaValidator,
		},
		onSubmit: async ({ value }) => {
			setPuntosError(null)
			if (puntos.every(punto => punto === 0))
				return setPuntosError("Debe agregar al menos un punto de medición")
			const newArea: AreaIluminacionType = {
				...value,
				userId: area.userId,
				id: area.id,
				puntos,
				timestamps,
				imagenes: [],
			}
			const result = await updateNRpart2({ data: newArea })
			if (!result) {
				console.error("Error al actualizar area", error)
				return
			}
			console.log("Area actualizada exitosamente")
			setOpen(false)
			setIsMenuOpen(false)
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
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={e => field.handleChange(e.target.value)}
										aria-invalid={isInvalid}
										className="bg-background sm:bg-accent text-sm"
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

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-5/6 mt-10 mx-auto">
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

				<div className="flex flex-col gap-1 w-5/6 mx-auto sm:w-full">
					<Label className="tracking-wider" htmlFor="largo">
						Imágenes del Área
					</Label>
					<div className="card p-2 bg-background ">
						<InputFiles
							text="Imágenes del área a medir."
							files={planoFiles}
							setFiles={setPlanoFiles}
							editMode={true}
						/>
					</div>
				</div>

				<form.Subscribe
					selector={state => [
						state.values.largo,
						state.values.ancho,
						state.values.alto,
					]}
					children={([largo, ancho, alto]) => {
						return (
							largo > 0 &&
							ancho > 0 &&
							alto > 0 && (
								<>
									<Formula
										alto={Number(alto)}
										ancho={Number(ancho)}
										largo={Number(largo)}
									/>
									<Grilla
										puntos={puntos}
										setPuntos={setPuntos}
										timestamps={timestamps}
										setTimestamps={setTimestamps}
										ancho={Number(ancho)}
										largo={Number(largo)}
										alto={Number(alto)}
									/>
								</>
							)
						)
					}}
				/>

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

				{puntosError && (
					<p className="text-center italic textXS text-red-500/70">
						{puntosError}
					</p>
				)}
				{error && (
					<p className="text-center italic textXS text-red-500/70">
						{error.message}
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
	ancho,
	largo,
	alto,
	timestamps,
	setTimestamps,
}: {
	ancho: number
	largo: number
	alto: number
	puntos: number[]
	setPuntos: Dispatch<SetStateAction<number[]>>
	timestamps: Date[]
	setTimestamps: Dispatch<SetStateAction<Date[]>>
}) {
	const [openInputMenu, setOpenInputMenu] = useState<boolean>(false)
	const [actualPunto, setActualPunto] = useState<number | null>(null)

	const indiceDeLocal = getIndiceDeLocal(largo, ancho, alto)
	const indiceRedondeo = getIndiceRedondeo(indiceDeLocal)
	const celdas = (indiceRedondeo + 2) ** 2
	const div = Math.sqrt(celdas).toFixed(0)
	const divisionesLargo = Number(div)
	const divisionesAncho = Number(div)
	const largoRatio = 150 * divisionesLargo
	const anchoGrilla = `${(ancho / largo) * largoRatio}px`
	const largoGrilla = `${150 * divisionesLargo}px`

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
								className={`border border-cyan-300/20 flex items-center justify-center ${puntos[index] !== 0 ? "bg-cyan-300/20" : ""}`}
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
				className="w-15 text-xl font-semibold py-1 px-3 card bg-accent sm:bg-accent text-foreground justify-center items-center min-h-9"
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
		<div className="card bg-background items-center justify-center gap-10 flex-col w-full p-10">
			<span className="textL border-b py-2 border-foreground/50 w-full text-left text-foreground/70">
				Punto {actualPunto !== null ? actualPunto + 1 : ""}
			</span>
			<input
				ref={inputRef}
				defaultValue={
					actualPunto !== null && puntos[actualPunto] !== 0
						? puntos[actualPunto]
						: ""
				}
				type="number"
				id="punto"
				name="punto"
				className="dark:bg-foreground/50 bg-foreground/5 text-background/75 textXL text-4xl w-3/4 sm:w-1/2 p-4 h-20 text-center rounded-md"
				onChange={e => setPuntoValue(e.currentTarget.value)}
			/>
			<div className="w-full flex justify-between gap-2 textM">
				<button
					type="button"
					onClick={() => setOpenInputMenu(false)}
					className="card p-2 my-shadow cursor-pointer bg-background justify-center flex-1"
				>
					Cancelar
				</button>
				<button
					type="button"
					className="card p-2 bg-accent my-shadow cursor-pointer justify-center flex-1"
					onClick={handleSetPunto}
				>
					Guardar
				</button>
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
