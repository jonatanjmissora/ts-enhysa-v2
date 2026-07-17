import BackChevron from "#/components/back-chevron"
import Loading from "#/components/loading"
import Title from "#/components/title"
import useScrollTop from "#/hooks/scroll-top"
import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute, Link } from "@tanstack/react-router"
import { Suspense, useState } from "react"
import { useForm } from "@tanstack/react-form"
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "#/components/ui/field"
import { Input } from "#/components/ui/input"
import { Lightbulb, Loader } from "lucide-react"
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
	type IluminacionFuenteType,
	type IluminacionTipoType,
	type IluminacionType,
} from "#/lib/constants"
import { ValorRequeridoField } from "#/components/reportes/iluminacion/valor-requerido-field"
import { Textarea } from "#/components/ui/textarea"
import { FilesDropzone } from "#/components/upload-button"
import { Button } from "#/components/ui/button"
import { Label } from "#/components/ui/label"
import { localizadaQueryOptions } from "../../../../../../../../../queries/reportes/iluminacion/localizadas/localizadas-query"
import type { LocalizadaIluminacionType } from "../../../../../../../../../db/reportes/iluminacion/localizadas/schema"
import { useUpdateLocalizada } from "../../../../../../../../../queries/reportes/iluminacion/localizadas/use-update-localizada"
import { updateLocalizadaValidator } from "../../../../../../../../../db/reportes/iluminacion/localizadas/localizada-validator"
import { checkLocalizadaDifferences } from "#/lib/utils"

export const Route = createFileRoute(
	"/_protected/iluminacion/reportes/$id/medicion/localizadas/$localizadaId/edit-localizada"
)({
	component: RouteComponent,
})

function RouteComponent() {
	useScrollTop()
	return (
		<article className="w-full min-h-svh flex flex-col items-center gap-0 relative mb-60">
			<BackChevron to="/iluminacion/reportes/$id/medicion" />
			<Title text="Editar Localizada" className="mt-15" />
			<Suspense
				fallback={
					<Loading
						text="obteniendo informe..."
						className="scale-50 justify-start  max-h-[50svh] "
					/>
				}
			>
				<EditLocalizadaData />
			</Suspense>
		</article>
	)
}

function EditLocalizadaData() {
	const { id, localizadaId } = Route.useParams()
	const { data: localizada } = useSuspenseQuery(
		localizadaQueryOptions({ localizadaId })
	)

	if (!localizada) return <span>La localizada no existe</span>

	return <EditLocalizada id={id} localizada={localizada} />
}

function EditLocalizada({
	id,
	localizada,
}: {
	id: string
	localizada: LocalizadaIluminacionType
}) {
	const [planoFiles, setPlanoFiles] = useState<string[]>(
		localizada.imagenes || []
	)
	const navigate = Route.useNavigate()

	const {
		mutateAsync: updateLocalizada,
		isPending,
		error,
	} = useUpdateLocalizada()

	const form = useForm({
		defaultValues: {
			...localizada,
		},
		validators: {
			onSubmit: updateLocalizadaValidator,
		},
		onSubmit: async ({ value }) => {
			if (checkLocalizadaDifferences(value, planoFiles, localizada)) {
				return navigate({
					to: "/iluminacion/reportes/$id/medicion2",
					params: {
						id: id,
					},
				})
			}
			const newLocalizada: LocalizadaIluminacionType = {
				...value,
				userId: localizada.userId,
				timestamps: [new Date()],
				id: localizada.id,
				imagenes: planoFiles,
			}
			const result = await updateLocalizada({ data: newLocalizada })
			if (!result) {
				console.error("Error al actualizar la localizada", error)
				return
			}
			console.log("La localizada actualizada exitosamente")
			navigate({
				to: "/iluminacion/reportes/$id/medicion2",
				params: {
					id: id,
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
			className="w-11/12 sm:w-full my-5 sm:my-4 flex flex-col gap-8 relative"
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

					<form.Field name="valorRequerido">
						{field => (
							<ValorRequeridoField
								field={field}
								from={`/iluminacion/reportes/${id}/medicion/localizadas/${localizada.id}/edit-localizada`}
								label="Valor Requerido (lux)"
							/>
						)}
					</form.Field>

					<form.Field
						name="valor"
						children={field => {
							const isInvalid =
								field.state.meta.isTouched && !field.state.meta.isValid
							return (
								<Field data-invalid={isInvalid} className="relative gap-1">
									<FieldLabel
										htmlFor={field.name}
										className="flex items-center gap-3 textL"
									>
										Valor (lux)
									</FieldLabel>
									<Input
										id={field.name}
										name={field.name}
										value={field.state.value || ""}
										onBlur={field.handleBlur}
										onChange={e => field.handleChange(Number(e.target.value))}
										aria-invalid={isInvalid}
										type="number"
										className="bg-background sm:bg-accent text-sm text-center"
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

				<div className="flex flex-col gap-1 w-5/6 mx-auto sm:w-full my-10">
					<Label className="tracking-wider" htmlFor="largo">
						Imágenes de la localizada
					</Label>
					<FilesDropzone
						text="Imágenes Area"
						defaultValue={planoFiles}
						onUploaded={url => {
							setPlanoFiles(url)
						}}
					/>
				</div>

				<Field className="flex flex-col justify-center gap-4 sm:flex-row items-center w-5/6 mx-auto sm:w-full mt-10">
					<Button
						variant="outline"
						type="button"
						disabled={isPending}
						className="flex-1 py-4"
					>
						<Link to={`/iluminacion/reportes/$id/medicion`} params={{ id }}>
							Volver
						</Link>
					</Button>
					<Button type="submit" disabled={isPending} className="flex-1 py-4">
						{isPending ? (
							<div className="flex gap-2 w-full justify-center">
								Editando... <Loader className="animate-spin size-4"></Loader>
							</div>
						) : (
							"Siguiente"
						)}
					</Button>
				</Field>

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
