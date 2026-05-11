import BackChevron from "#/components/back-chevron"
import Loading from "#/components/loading"
import Title from "#/components/title"
import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { Suspense } from "react"
import { reporteNuevoQueryOptions } from "../../../../../../queries/reportes/iluminacion/reportes-query"
import { useForm } from "@tanstack/react-form"
import { useUpdateReporteNuevo } from "../../../../../../queries/reportes/iluminacion/use-update-reporte-nuevo"

export const Route = createFileRoute(
	"/_protected/iluminacion/nuevo-informe/opinon/"
)({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<article className="w-full min-h-svh flex flex-col items-center gap-0 relative mb-60">
			<BackChevron to="/iluminacion" />
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

	// const {
	// 	mutateAsync: updateOpinion,
	// 	isPending,
	// 	error,
	// } = useUpdateReporteNuevo()

	const form = useForm({
		defaultValues: { ...reporteNuevo },
		validators: {
			// onSubmit: reporteNuevoOpinionFormValidator,
		},
		onSubmit: async ({ value }) => {
			console.log("VALUES: ", value)
			// if (
			// 	reporteNuevo &&
			// 	value.conclusion === reporteNuevo.conclusion &&
			// 	value.observacion === reporteNuevo.observacion &&
			// 	value.recomendacion === reporteNuevo.recomendacion
			// )
			// 	return

			// 		const updateReporteNuevo = {
			// 			...value,
			// 			id: reporteNuevo?.id ?? "",
			// 			userId: reporteNuevo?.userId ?? "",
			//       finishedAt: new Date(),
			//       observaciones: value.observacion,
			//       recomendaciones: value.recomendacion,
			//       conclusiones: value.conclusion,
			// 		}

			// 		const result = await updateOpinion({ data: updateReporteNuevo })
			// 		if (!result) {
			// 			console.error("Error al editar nuevo reporte", updateError)
			//     }
		},
	})

	return <span>OPINIONES</span>
}
