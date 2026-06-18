import BackChevron from "#/components/back-chevron"
import Loading from "#/components/loading"
import Title from "#/components/title"
import useScrollTop from "#/hooks/scroll-top"
import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { Suspense } from "react"
import { reporteQueryOptions } from "../../../../../../../queries/reportes/iluminacion/reportes-query"
import { empresasQueryOptions } from "../../../../../../../queries/empresas/empresas-query"
import { instrumentosQueryOptions } from "../../../../../../../queries/instrumentos/instrumentos-query"
import { useUpdateReporte } from "../../../../../../../queries/reportes/iluminacion/use-update-reporte"
import { useForm } from "@tanstack/react-form"
import { reporteNuevoFormValidator } from "../../../../../../../db/reportes/iluminacion/reporte-validator"
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "#/components/ui/field"
import { ChevronRight, Loader, Warehouse } from "lucide-react"
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "#/components/ui/select"
import { Cpu } from "lucide-react"
import {
	ESTADO,
	HUMEDAD,
	TEMPERATURA,
	type EstadoType,
	type HumedadType,
	type TemperaturaType,
} from "#/lib/constants"
import { Button } from "#/components/ui/button"
import type { EmpresaType } from "../../../../../../../db/empresas/schema"

export const Route = createFileRoute(
	"/_protected/iluminacion/reportes/$id/_CRUD/crud/edit-general"
)({
	component: RouteComponent,
})

function RouteComponent() {
	useScrollTop()

	return (
		<article className="w-full min-h-svh flex flex-col items-center gap-10 relative mb-60">
			<BackChevron to="/iluminacion/reportes" />
			<Title text="Nuevo Informe" className="mt-15" />
			<IluminacionGeneralData />
		</article>
	)
}

function IluminacionGeneralData() {
	return (
		<Suspense
			fallback={
				<Loading
					text="verificando reporte en curso..."
					className="scale-50 justify-start  max-h-[50svh] "
				/>
			}
		>
			<EditReporteGeneral />
		</Suspense>
	)
}

function EditReporteGeneral() {
	const { id } = Route.useParams()
	const { data: reporte } = useSuspenseQuery(reporteQueryOptions({ id }))
	const { data: empresas } = useSuspenseQuery(empresasQueryOptions)
	const { data: instrumentos } = useSuspenseQuery(instrumentosQueryOptions)
	const navigate = useNavigate()

	const { mutateAsync: editarReporte, isPending, error } = useUpdateReporte()

	const form = useForm({
		defaultValues: {
			empresaId: reporte?.empresaId || "",
			instrumentoId: reporte?.instrumentoId || "",
			clima: reporte?.clima || ["despejado", "10", "10"],
		},
		validators: {
			onSubmit: reporteNuevoFormValidator,
		},
		onSubmit: async ({ value }) => {
			if (!empresas || !instrumentos || !reporte) return

			const newReport = {
				...reporte,
				empresaId: value.empresaId,
				instrumentoId: value.instrumentoId,
				clima: value.clima,
			}

			if (reporte.empresaId !== value.empresaId) {
				newReport.title = getTitle(value.empresaId || "", empresas)
			}

			if (
				reporte.empresaId === value.empresaId &&
				reporte.instrumentoId === value.instrumentoId &&
				reporte.clima[0] === value.clima[0] &&
				reporte.clima[1] === value.clima[1] &&
				reporte.clima[2] === value.clima[2]
			) {
				return navigate({
					to: "/iluminacion/reportes/$id/medicion",
					params: {
						id: id,
					},
				})
			}

			const result = await editarReporte({ data: newReport })
			if (!result) {
				console.error("Error al editar el reporte", error)
			}
			console.log("Reporte editado exitosamente")
			navigate({
				to: "/iluminacion/reportes/$id/medicion",
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
			className="w-3/4 sm:w-1/2 mx-auto flex flex-col gap-8 relative"
		>
			<FieldGroup className="gap-5">
				<form.Field
					name="empresaId"
					children={field => {
						const isInvalid =
							field.state.meta.isTouched && !field.state.meta.isValid

						return (
							<Field data-invalid={isInvalid} className="relative gap-1">
								<FieldLabel
									htmlFor={field.name}
									className="flex items-center gap-3 textL"
								>
									<Warehouse className="size-6" />
									Empresa receptora
								</FieldLabel>

								<Select
									value={field.state.value || ""}
									onValueChange={value => field.handleChange(value)}
								>
									<SelectTrigger
										id={field.name}
										name={field.name}
										onBlur={field.handleBlur}
										aria-invalid={isInvalid}
										className="w-full justify-end"
									>
										<SelectValue placeholder="Seleccione Empresa" />
									</SelectTrigger>

									<SelectContent position="popper">
										<SelectGroup>
											<SelectLabel>Empresas</SelectLabel>

											{empresas?.map(empresa => (
												<SelectItem
													key={empresa.id}
													value={empresa.id}
													className="justify-center"
												>
													{empresa.razonSocial.toUpperCase()} -{" "}
													{empresa.direccion.toUpperCase()}
												</SelectItem>
											))}
										</SelectGroup>
									</SelectContent>
								</Select>

								{isInvalid && (
									<FieldError
										errors={field.state.meta.errors}
										className="text-xs 2xl:text-sm absolute -bottom-4 left-0 text-right"
									/>
								)}
							</Field>
						)
					}}
				/>

				<form.Field
					name="instrumentoId"
					children={field => {
						const isInvalid =
							field.state.meta.isTouched && !field.state.meta.isValid

						return (
							<Field data-invalid={isInvalid} className="relative gap-1">
								<FieldLabel
									htmlFor={field.name}
									className="flex items-center gap-3 textL"
								>
									<Cpu className="size-6" /> Instrumento utilizado
								</FieldLabel>

								<Select
									value={field.state.value || ""}
									onValueChange={value => field.handleChange(value)}
								>
									<SelectTrigger
										id={field.name}
										name={field.name}
										onBlur={field.handleBlur}
										aria-invalid={isInvalid}
										className="w-full justify-end"
									>
										<SelectValue placeholder="Seleccione Instrumento" />
									</SelectTrigger>

									<SelectContent position="popper">
										<SelectGroup>
											<SelectLabel>Instrumentos</SelectLabel>

											{instrumentos?.map(instrumento => (
												<SelectItem
													key={instrumento.id}
													value={instrumento.id}
													className="justify-center"
												>
													{instrumento.nombre.toUpperCase()} -{" "}
													{instrumento.marca.toUpperCase()}
												</SelectItem>
											))}
										</SelectGroup>
									</SelectContent>
								</Select>

								{isInvalid && (
									<FieldError
										errors={field.state.meta.errors}
										className="text-xs 2xl:text-sm absolute -bottom-4 left-0  text-right"
									/>
								)}
							</Field>
						)
					}}
				/>

				<form.Field
					name="clima[0]"
					children={field => {
						const isInvalid =
							field.state.meta.isTouched && !field.state.meta.isValid

						return (
							<Field data-invalid={isInvalid} className="relative gap-1">
								<FieldLabel
									htmlFor={field.name}
									className="flex items-center gap-3 textL"
								>
									Clima
								</FieldLabel>

								<Select
									value={field.state.value || ""}
									onValueChange={value =>
										field.handleChange(value as EstadoType)
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
											<SelectLabel>Clima</SelectLabel>

											{ESTADO?.map(clima => (
												<SelectItem
													key={clima}
													value={clima}
													className="justify-center"
												>
													{clima.toUpperCase()}
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
					name="clima[1]"
					children={field => {
						const isInvalid =
							field.state.meta.isTouched && !field.state.meta.isValid

						return (
							<Field data-invalid={isInvalid} className="relative gap-1">
								<FieldLabel
									htmlFor={field.name}
									className="flex items-center gap-3 textL"
								>
									Humedad
								</FieldLabel>

								<Select
									value={field.state.value || ""}
									onValueChange={value =>
										field.handleChange(value as HumedadType)
									}
								>
									<SelectTrigger
										id={field.name}
										name={field.name}
										onBlur={field.handleBlur}
										aria-invalid={isInvalid}
										className="w-full justify-end"
									>
										<SelectValue placeholder="Seleccione Humedad" />
									</SelectTrigger>

									<SelectContent position="popper">
										<SelectGroup>
											<SelectLabel>Humedad</SelectLabel>

											{HUMEDAD?.map(humedad => (
												<SelectItem
													key={humedad}
													value={humedad}
													className="justify-center"
												>
													{humedad.toUpperCase()}
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
					name="clima[2]"
					children={field => {
						const isInvalid =
							field.state.meta.isTouched && !field.state.meta.isValid

						return (
							<Field data-invalid={isInvalid} className="relative gap-1">
								<FieldLabel
									htmlFor={field.name}
									className="flex items-center gap-3 textL"
								>
									Temperatura
								</FieldLabel>

								<Select
									value={field.state.value || ""}
									onValueChange={value =>
										field.handleChange(value as TemperaturaType)
									}
								>
									<SelectTrigger
										id={field.name}
										name={field.name}
										onBlur={field.handleBlur}
										aria-invalid={isInvalid}
										className="w-full justify-end"
									>
										<SelectValue placeholder="Seleccione Temperatura" />
									</SelectTrigger>

									<SelectContent position="popper">
										<SelectGroup>
											<SelectLabel>Temperatura</SelectLabel>

											{TEMPERATURA?.map(temperatura => (
												<SelectItem
													key={temperatura}
													value={temperatura}
													className="justify-center"
												>
													{temperatura.toUpperCase()}
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

				<Field className="flex flex-col justify-center gap-4 sm:gap-10 items-center w-full sm:w-1/2 mx-auto mt-30">
					<Button type="submit" disabled={isPending} className="flex-1 py-3">
						{isPending ? (
							<div className="flex gap-2 w-full justify-center items-center">
								Guardando... <Loader className="animate-spin size-4"></Loader>
							</div>
						) : (
							<div className="flex gap-2 w-full justify-center items-center">
								Siguiente <ChevronRight className="size-6" />
							</div>
						)}
					</Button>
				</Field>

				{error && <p>{error.message}</p>}

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

function getTitle(empresaId: string, empresas: EmpresaType[]) {
	const empresa = empresas.find(e => e.id === empresaId)
	if (!empresa) return ""
	return `${empresa.razonSocial} - ${empresa.direccion}`
}
