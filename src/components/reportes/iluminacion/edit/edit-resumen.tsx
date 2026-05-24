import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "#/components/ui/alert-dialog"
import { Edit, List, Loader, NotebookPen, Search } from "lucide-react"
import Title from "#/components/title"
import type { ReporteIluminacionType } from "../../../../../db/reportes/iluminacion/schema"
import { useState } from "react"
import { useUpdateReporte } from "../../../../../queries/reportes/iluminacion/use-update-reporte"
import { useForm } from "@tanstack/react-form"
import { reporteOpinionFormValidator } from "../../../../../db/reportes/iluminacion/reporte-validator"
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "#/components/ui/field"
import { Button } from "#/components/ui/button"

export default function EditResumenAlert({
	reporte,
	setIsMenuOpen,
}: {
	reporte: ReporteIluminacionType
	setIsMenuOpen: (open: boolean) => void
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
			<AlertDialogContent className="sm:px-20 py-15 sm:py-6 w-full h-screen sm:h-[95dvh] overflow-auto border-none rounded-none max-w-screen">
				<AlertDialogTitle>
					<Title text="Editar Resumen" />
				</AlertDialogTitle>
				<AlertDialogDescription asChild>
					<div className="text-center">
						<EditResumen
							reporte={reporte}
							setOpen={setOpen}
							setIsMenuOpen={setIsMenuOpen}
						/>
					</div>
				</AlertDialogDescription>
			</AlertDialogContent>
		</AlertDialog>
	)
}

function EditResumen({
	reporte,
	setOpen,
	setIsMenuOpen,
}: {
	reporte: ReporteIluminacionType
	setOpen: (open: boolean) => void
	setIsMenuOpen: (open: boolean) => void
}) {
	const { mutateAsync: updateOpinion, isPending, error } = useUpdateReporte()

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
			)
				return

			const updateReporteNuevo = {
				...reporte,
				finishedAt: reporte.finishedAt ? new Date() : undefined,
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
			setOpen(false)
			setIsMenuOpen?.(false)
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

					<Field className="flex flex-col sm:flex-row justify-center gap-4 items-center w-full mx-auto mt-10">
						<Button
							variant="outline"
							onClick={() => {
								setOpen(false)
								setIsMenuOpen?.(false)
							}}
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
