import BackChevron from "#/components/back-chevron"
import Loading from "#/components/loading"
import Title from "#/components/title"
import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { Suspense } from "react"
import { reporteNuevoQueryOptions } from "../../../../../../queries/reportes/iluminacion/reportes-query"
import { useForm } from "@tanstack/react-form"
import { useUpdateReporteNuevo } from "../../../../../../queries/reportes/iluminacion/use-update-reporte-nuevo"
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "#/components/ui/field"
import { List, Loader, NotebookPen, Search } from "lucide-react"
import { Button } from "#/components/ui/button"
import { reporteOpinionFormValidator } from "../../../../../../db/reportes/iluminacion/reporte-validator"
import { ESTADO, HUMEDAD, TEMPERATURA } from "#/lib/constants"

export const Route = createFileRoute(
	"/_protected/iluminacion/nuevo-informe/opinion/"
)({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<article className="w-full min-h-svh flex flex-col items-center gap-0 relative mb-60">
			<BackChevron to="/iluminacion/nuevo-informe/areas" />
			<Title text="Nuevo Informe" className="mt-15" />
			<IluminacionOpinion />
		</article>
	)
}

function IluminacionOpinion() {
	return (
		<Suspense
			fallback={
				<Loading
					text="obteniendo opiniones..."
					className="scale-50 justify-start  max-h-[50svh] "
				/>
			}
		>
			<Opinion />
		</Suspense>
	)
}

function Opinion() {
	const { data: reporteNuevo } = useSuspenseQuery(reporteNuevoQueryOptions)
	const navigate = useNavigate()

	const {
		mutateAsync: updateOpinion,
		isPending,
		error,
	} = useUpdateReporteNuevo()

	const form = useForm({
		defaultValues: {
			observacion: reporteNuevo?.observacion ?? "",
			recomendacion: reporteNuevo?.recomendacion ?? "",
			conclusion: reporteNuevo?.conclusion ?? "",
		},
		validators: {
			onSubmit: reporteOpinionFormValidator,
		},
		onSubmit: async ({ value }) => {
			if (
				reporteNuevo &&
				value.conclusion === reporteNuevo.conclusion &&
				value.observacion === reporteNuevo.observacion &&
				value.recomendacion === reporteNuevo.recomendacion
			)
				return

			const updateReporteNuevo = {
				finishedAt: new Date(),
				tecnicoId: reporteNuevo?.tecnicoId ?? "",
				empresaId: reporteNuevo?.empresaId ?? "",
				instrumentoId: reporteNuevo?.instrumentoId ?? "",
				clima: reporteNuevo?.clima ?? [ESTADO[0], HUMEDAD[5], TEMPERATURA[3]],
				createdAt: reporteNuevo?.createdAt ?? new Date(),
				id: reporteNuevo?.id ?? "",
				userId: reporteNuevo?.userId ?? "",
				title: reporteNuevo?.title ?? "",
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
			navigate({ to: `/iluminacion/reportes/${reporteNuevo?.id}/general` })
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
