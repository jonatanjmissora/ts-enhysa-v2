import { useForm } from "@tanstack/react-form"
import {
	defaultReporteData,
	reporteNuevoFormValidator,
} from "../../../../db/reportes/iluminacion/reporte-validator"
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "#/components/ui/field"
import { ChevronLeft, ChevronRight, Cpu, Loader, Warehouse } from "lucide-react"
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "#/components/ui/select"
import { useSuspenseQuery } from "@tanstack/react-query"
import { empresasQueryOptions } from "../../../../queries/empresas/empresas-query"
import { instrumentosQueryOptions } from "../../../../queries/instrumentos/instrumentos-query"
import { tecnicoQueryOptions } from "../../../../queries/tecnico/tecnico-query"
import { Suspense } from "react"
import {
	ESTADO,
	HUMEDAD,
	TEMPERATURA,
	type EstadoType,
	type HumedadType,
	type TemperaturaType,
} from "#/lib/constants"
import { Button } from "#/components/ui/button"
import Loading from "#/components/loading"
import { Link, useNavigate } from "@tanstack/react-router"
import useScrollTop from "#/hooks/scroll-top"
import { useCreateNuevoReporte } from "../../../../queries/reportes/iluminacion/use-create-reporte"
import type { EmpresaType } from "../../../../db/empresas/schema"

export default function ReporteNuevoIluminacion() {
	return (
		<Suspense
			fallback={
				<Loading
					text="cargando datos del usuario..."
					className="scale-50 justify-start  max-h-[50svh] "
				/>
			}
		>
			<ReporteNuevo />
		</Suspense>
	)
}

function ReporteNuevo() {
	useScrollTop()
	const { data: tecnico } = useSuspenseQuery(tecnicoQueryOptions)
	const { data: empresas } = useSuspenseQuery(empresasQueryOptions)
	const { data: instrumentos } = useSuspenseQuery(instrumentosQueryOptions)
	const navigate = useNavigate()

	const {
		mutateAsync: createNewReport,
		isPending,
		error,
	} = useCreateNuevoReporte()
	const form = useForm({
		defaultValues: defaultReporteData,
		validators: {
			onSubmit: reporteNuevoFormValidator,
		},
		onSubmit: async ({ value }) => {
			if (!tecnico || !empresas || !instrumentos) return

			const title = getTitle(value.empresaId, empresas)

			const newReport = {
				...value,
				tecnicoId: tecnico.id,
				title,
			}
			const result = await createNewReport({ data: newReport })
			if (!result) {
				console.error("Error al crear el reporte", error)
			}
			console.log("Reporte creado exitosamente")
			navigate({ to: "/iluminacion/nuevo-informe/areas" })
		},
	})
	if (!tecnico || !empresas?.length || !instrumentos?.length)
		return (
			<article className="w-full flex flex-col justify-center items-center min-h-[30svh] gap-10">
				<span className="text-foreground/50 text-sm italic text-center w-5/6 mx-auto">
					Debe completar los datos del técnico, empresa o instrumento en su
					perfil primero.
				</span>
				<Link to="/perfil/tecnicos" className="w-1/2 mx-auto">
					<Button className="w-full py-4">Ir al perfil</Button>
				</Link>
			</article>
		)

	return (
		<form
			id="create-form"
			onSubmit={e => {
				e.preventDefault()
				form.handleSubmit()
			}}
			className="w-3/4 mx-auto flex flex-col gap-8 relative"
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
													{empresa.razonSocial.toUpperCase()}
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
													{instrumento.nombre.toUpperCase()}
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

				<Field className="flex flex-col justify-center gap-4 sm:gap-10 items-center w-full mx-auto mt-20">
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
