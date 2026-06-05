import BackChevron from "#/components/back-chevron"
import Loading from "#/components/loading"
import Title from "#/components/title"
import useScrollTop from "#/hooks/scroll-top"
import { Suspense } from "react"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useSuspenseQuery } from "@tanstack/react-query"
import { reporteQueryOptions } from "../../../../../../../queries/reportes/iluminacion/reportes-query"
import type { ReporteIluminacionType } from "../../../../../../../db/reportes/iluminacion/schema"
import { useFinalReporteNuevo } from "../../../../../../../queries/reportes/iluminacion/use-final-reporte-nuevo"
import { useForm } from "@tanstack/react-form"
import { reporteOpinionFormValidator } from "../../../../../../../db/reportes/iluminacion/reporte-validator"
import { ESTADO, HUMEDAD, TEMPERATURA } from "#/lib/constants"
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "#/components/ui/field"
import { List, Loader, NotebookPen, Search } from "lucide-react"
import { Button } from "#/components/ui/button"

export const Route = createFileRoute(
	"/_protected/iluminacion/reportes/$id/_CRUD/crud/create-resumen"
)({
	component: RouteComponent,
})

function RouteComponent() {
	const { id } = Route.useParams()
	useScrollTop()
	return (
		<article className="w-full min-h-svh flex flex-col items-center gap-0 relative mb-60">
			<BackChevron to="/iluminacion/reportes/$id/areas" params={{ id }} />
			<Title text="Nuevo Informe" className="mt-15" />
			<Suspense
				fallback={
					<Loading
						text="obteniendo informe..."
						className="scale-50 justify-start  max-h-[50svh] "
					/>
				}
			>
				<CreateResumenData />
			</Suspense>
		</article>
	)
}

function CreateResumenData() {
	const { id } = Route.useParams()
	const { data: reporte } = useSuspenseQuery(reporteQueryOptions({ id }))

	if (!reporte) return <span>No existe el reporte</span>
	return <CreateResumen reporte={reporte} />
}

function CreateResumen({ reporte }: { reporte: ReporteIluminacionType }) {
	const navigate = useNavigate()

	const {
		mutateAsync: updateOpinion,
		isPending,
		error,
	} = useFinalReporteNuevo()

	const form = useForm({
		defaultValues: {
			observacion: reporte.observacion ?? "",
			recomendacion: reporte.recomendacion ?? "",
			conclusion: reporte.conclusion ?? "",
		},
		validators: {
			onSubmit: reporteOpinionFormValidator,
		},
		onSubmit: async ({ value }) => {
			if (
				reporte &&
				value.conclusion === reporte.conclusion &&
				value.observacion === reporte.observacion &&
				value.recomendacion === reporte.recomendacion
			) {
				navigate({ to: `/iluminacion/reportes` })
				return
			}

			const updateReporteNuevo = {
				finishedAt: new Date(),
				tecnicoId: reporte.tecnicoId ?? "",
				empresaId: reporte.empresaId ?? "",
				instrumentoId: reporte.instrumentoId ?? "",
				clima: reporte.clima ?? [ESTADO[0], HUMEDAD[5], TEMPERATURA[3]],
				createdAt: reporte.createdAt ?? new Date(),
				id: reporte.id ?? "",
				userId: reporte.userId ?? "",
				title: reporte.title ?? "",
				observacion:
					value.observacion === "" ? "Sin Observaciones" : value.observacion,
				recomendacion:
					value.recomendacion === ""
						? "Sin Recomendaciones"
						: value.recomendacion,
				conclusion:
					value.conclusion === "" ? "Análisis Pendiente" : value.conclusion,
			}

			const result = await updateOpinion({ data: updateReporteNuevo })
			if (!result) {
				console.error("Error al editar nuevo reporte", error)
			}
			console.log("Reporte Actualizado Exitosamente")
			navigate({ to: `/iluminacion/reportes` })
		},
	})

	return (
		<article className="w-full flex flex-col justify-center items-center my-20 mb-60">
			<form
				id="create-form"
				onSubmit={e => {
					e.preventDefault()
					form.handleSubmit()
				}}
				className="w-5/6 relative"
			>
				<FieldGroup className="gap-10">
					<form.Field
						name="conclusion"
						children={field => {
							const isInvalid =
								field.state.meta.isTouched && !field.state.meta.isValid
							return (
								<Field data-invalid={isInvalid} className="relative gap-1">
									<FieldLabel
										htmlFor={field.name}
										className="flex items-center gap-3 textL"
									>
										<NotebookPen className="size-5 text-amber-500/70" />
										Conclusiónes Finales
									</FieldLabel>
									<textarea
										id={field.name}
										name={field.name}
										placeholder={`Conclusión final del reporte, análisis de los resultados de las mediciones, Conclusiones. En caso de no haber conclusiones, poner "Análisis Pendiente"`}
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={e => field.handleChange(e.target.value)}
										aria-invalid={isInvalid}
										onFocus={e => e.target.select()}
										className="min-h-[120px] text-xs italic text-foreground-50 tracking-wide py-4 px-2 ring-[1px] ring-foreground/15 rounded-lg bg-accent"
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
						name="observacion"
						children={field => {
							const isInvalid =
								field.state.meta.isTouched && !field.state.meta.isValid
							return (
								<Field data-invalid={isInvalid} className="relative gap-1">
									<FieldLabel
										htmlFor={field.name}
										className="flex items-center gap-3 textL"
									>
										<Search className="size-5 text-amber-500/70" />
										Observacion General
									</FieldLabel>
									<textarea
										id={field.name}
										name={field.name}
										placeholder={`Detalle general de las condiciones en las que tomamos las mediciones. En caso de no haber observaciones, poner "Sin Observaciones"`}
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={e => field.handleChange(e.target.value)}
										aria-invalid={isInvalid}
										onFocus={e => e.target.select()}
										className="min-h-[120px] text-xs italic text-foreground-50 tracking-wide py-4 px-2 ring-[1px] ring-foreground/15 rounded-lg bg-accent"
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
						name="recomendacion"
						children={field => {
							const isInvalid =
								field.state.meta.isTouched && !field.state.meta.isValid
							return (
								<Field data-invalid={isInvalid} className="relative gap-1">
									<FieldLabel
										htmlFor={field.name}
										className="flex items-center gap-3 textL"
									>
										<List className="size-5 text-amber-500/70" />
										Recomendaciones Generales
									</FieldLabel>
									<textarea
										id={field.name}
										name={field.name}
										placeholder={`Luego de realizar un análisis de los resultados de las mediciones, dar nuestro asesoramiento técnico, oportunidad de mejora, condiciones de mejora, cambios solicitados. En caso de no tener recomendaciones, poner "Sin Recomendaciones"`}
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={e => field.handleChange(e.target.value)}
										aria-invalid={isInvalid}
										onFocus={e => e.target.select()}
										className="min-h-[120px] text-xs italic text-foreground-50 tracking-wide py-4 px-2 ring-[1px] ring-foreground/15 rounded-lg bg-accent"
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

					<Field className="flex flex-col justify-center gap-4 sm:gap-10 items-center w-full mx-auto mt-20 p-0">
						<Button type="submit" disabled={isPending} className="flex-1 py-3">
							{isPending ? (
								<div className="flex gap-2 w-full justify-center items-center">
									Finalizando...{" "}
									<Loader className="animate-spin size-4"></Loader>
								</div>
							) : (
								<span>Finalizar</span>
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
		</article>
	)
}
