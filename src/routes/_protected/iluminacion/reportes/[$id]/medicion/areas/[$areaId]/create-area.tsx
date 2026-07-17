import BackChevron from "#/components/back-chevron"
import Title from "#/components/title"
import useScrollTop from "#/hooks/scroll-top"
import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router"
import { Suspense, useState } from "react"
import { useForm } from "@tanstack/react-form"
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "#/components/ui/field"
import { Input } from "#/components/ui/input"
import { Box, Lightbulb, Loader } from "lucide-react"
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "#/components/ui/select"
import {
	ILUMINACION,
	ILUMINACION_FUENTE,
	ILUMINACION_TIPO,
	VALORES_REQUERIDOS,
	type IluminacionFuenteType,
	type IluminacionTipoType,
	type IluminacionType,
	type ValoresRequeridosType,
} from "#/lib/constants"
import { Textarea } from "#/components/ui/textarea"
import { Label } from "#/components/ui/label"
import { FilesDropzone } from "#/components/upload-button"
import {
	getIndiceDeLocal,
	getIndiceRedondeo,
} from "#/components/reportes/iluminacion/pdf/page-5"
import Formula from "#/components/reportes/iluminacion/nuevo-informe/mediciones/formula"
import { Button } from "#/components/ui/button"
import Loading from "#/components/loading"
import { reporteQueryOptions } from "../../../../../../../../../queries/reportes/iluminacion/reportes-query"
import { useCreateArea } from "../../../../../../../../../queries/reportes/iluminacion/areas/use-create-area"
import {
	areaFormValidator,
	defaultAreaData,
} from "../../../../../../../../../db/reportes/iluminacion/areas/area-validator"

export const Route = createFileRoute(
	"/_protected/iluminacion/reportes/$id/medicion/areas/$areaId/create-area"
)({
	component: RouteComponent,
})

function RouteComponent() {
	useScrollTop()
	const params = Route.useParams()
	return (
		<article className="w-full min-h-svh flex flex-col items-center gap-0 relative mb-60">
			<BackChevron to="/iluminacion/reportes/$id/medicion" params={params} />
			<Title text="Nueva Area" className="mt-15" />
			<Suspense
				fallback={
					<Loading
						text="obteniendo informe..."
						className="scale-50 justify-start  max-h-[50svh] "
					/>
				}
			>
				<CreateArea />
			</Suspense>
		</article>
	)
}

function CreateArea() {
	const { id } = Route.useParams()

	const [planoFiles, setPlanoFiles] = useState<string[]>([])
	const { data: reporte } = useSuspenseQuery(reporteQueryOptions({ id }))
	const navigate = useNavigate()
	// Pass medicionTipo where needed (example: include in navigation or API calls)
	const { mutateAsync: createArea, isPending, error } = useCreateArea()

	const form = useForm({
		defaultValues: defaultAreaData,
		validators: {
			onSubmit: areaFormValidator,
		},
		onSubmit: async ({ value }) => {
			if (!reporte) return
			const newArea = {
				...value,
				reportId: reporte.id,
				imagenes: planoFiles,
				id: crypto.randomUUID(),
			}
			const result = await createArea({ data: newArea })
			if (!result) {
				console.error("Error al crear area", error)
				return
			}
			console.log("Área creada exitosamente")
			navigate({
				to: `/iluminacion/reportes/$id/medicion/areas/$areaId/puntos`,
				params: {
					id,
					areaId: newArea.id,
				},
			})
		},
	})

	return (
		<form
			id="create-form"
			onSubmit={e => {
				e.preventDefault()
				form.handleSubmit()
			}}
			className="w-11/12 mx-auto my-5 sm:my-4 flex flex-col gap-8 relative"
		>
			<FieldGroup className="gap-5">
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10 w-5/6 mx-auto">
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
										onFocus={e => e.target.select()}
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
										onFocus={e => e.target.select()}
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

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-5/6 mb-10 mx-auto">
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
										<Link
											to="/teoria"
											search={{
												t: "iluminacionValoresRequeridos",
												from: `/iluminacion/reportes/${id}/medicion/areas/${crypto.randomUUID()}/create-area`,
											}}
											className="ml-auto border-b border-orange-500/75 text-xs text-orange-500"
										>
											Ver Tablas
										</Link>
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

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-5/6 mb-10 mx-auto items-end">
					<form.Field
						name="largo"
						children={field => {
							const isInvalid =
								field.state.meta.isTouched && !field.state.meta.isValid
							return (
								<Field
									data-invalid={isInvalid}
									className="relative flex-row gap-1"
								>
									<FieldLabel htmlFor={field.name}>Largo(m)</FieldLabel>
									<Input
										id={field.name}
										name={field.name}
										value={field.state.value}
										onBlur={field.handleBlur}
										onFocus={e => e.target.select()}
										onChange={e => field.handleChange(Number(e.target.value))}
										aria-invalid={isInvalid}
										placeholder="Ej. 4"
										type="number"
										className="text-center text-lg w-1/2"
									/>
									{isInvalid && (
										<FieldError
											errors={field.state.meta.errors}
											className="text-xs 2xl:text-sm absolute -bottom-4 right-0"
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
								<Field
									data-invalid={isInvalid}
									className="relative flex-row gap-1"
								>
									<FieldLabel htmlFor={field.name}>Ancho(m)</FieldLabel>
									<Input
										id={field.name}
										name={field.name}
										value={field.state.value}
										onBlur={field.handleBlur}
										onFocus={e => e.target.select()}
										onChange={e => field.handleChange(Number(e.target.value))}
										aria-invalid={isInvalid}
										placeholder="Ej. 5"
										type="number"
										className="text-center text-lg w-1/2"
									/>
									{isInvalid && (
										<FieldError
											errors={field.state.meta.errors}
											className="text-xs 2xl:text-sm absolute -bottom-4 right-0"
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
								<Field
									data-invalid={isInvalid}
									className="relative flex-row gap-1"
								>
									<FieldLabel htmlFor={field.name}>
										Alto del montaje (m)
									</FieldLabel>
									<Input
										id={field.name}
										name={field.name}
										value={field.state.value}
										onBlur={field.handleBlur}
										onFocus={e => e.target.select()}
										onChange={e => field.handleChange(Number(e.target.value))}
										aria-invalid={isInvalid}
										placeholder="Ej. 2"
										type="number"
										className="text-center text-lg w-1/2"
									/>
									{isInvalid && (
										<FieldError
											errors={field.state.meta.errors}
											className="text-xs 2xl:text-sm absolute -bottom-4 right-0"
										/>
									)}
								</Field>
							)
						}}
					/>

					<form.Subscribe
						selector={state =>
							`${state.values.largo}_${state.values.ancho}_${state.values.alto}`
						}
						children={values => {
							const [largo, ancho, alto] = values.split("_").map(Number)
							if (largo * ancho * alto < 0)
								return (
									<span className="text-red-700/50 italic text-sm">
										Los valores ingresados deben de ser positivos.
									</span>
								)
						}}
					/>
				</div>

				<div className="flex flex-col gap-1 w-5/6 mx-auto sm:w-full mb-10">
					<Label className="tracking-wider" htmlFor="largo">
						Imágenes del Área
					</Label>
					<FilesDropzone
						text="Imágenes Area"
						defaultValue={planoFiles}
						onUploaded={url => {
							setPlanoFiles(url)
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

						return (
							<Formula
								alto={Number(alto)}
								ancho={Number(ancho)}
								largo={Number(largo)}
								indiceDeLocal={indiceDeLocal}
								indiceRedondeo={newIndiceRedondeo}
							/>
						)
					}}
				/>

				<Field className="flex flex-col sm:flex-row justify-center gap-4 items-center w-5/6 sm:w-full mx-auto my-10">
					<Link
						to="/iluminacion/reportes/$id/medicion"
						params={{ id }}
						className="flex-1"
					>
						<Button
							variant="outline"
							type="button"
							disabled={isPending}
							className="flex-1 py-5 w-full"
						>
							Volver
						</Button>
					</Link>
					<Button
						type="submit"
						disabled={isPending}
						className="flex-1 py-3 w-full"
					>
						{isPending ? (
							<div className="flex gap-2 w-full justify-center items-center">
								Guardando... <Loader className="animate-spin size-4"></Loader>
							</div>
						) : (
							"Siguiente"
						)}
					</Button>
				</Field>

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
